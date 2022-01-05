import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { SiteNavbar } from "./SiteNavbar";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

const depts = [
    { id: 0, name: 'Frontend Development' },
    { id: 1, name: 'Backend Development' },
    { id: 2, name: 'Testing' },
    { id: 3, name: 'Deployment' },
]

export default function Dashboard() {
    const { register, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            id: '',
            name: '',
            gender: '',
            age: '',
            designation: '',
            dept: '',
            joinDate: '',
            avail: 1,
        }
    });
    const [isDomLoaded, setIsDomLoaded] = useState(false)
    const [employees, setEmployees] = useState((localStorage.getItem('empData') ? JSON.parse(localStorage.getItem('empData')) : []).sort((a, b) => a.avail < b.avail))
    const [empModal, setEmpModal] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterData, setFilterData] = useState([])

    useEffect(() => {
        if (!localStorage.getItem('empData'))
            localStorage.setItem('empData', JSON.stringify([]))
        setIsDomLoaded(true)
    }, [])
    useEffect(() => {
        localStorage.setItem('empData', JSON.stringify(employees))
        setSearchText('')
    }, [employees])

    useEffect(() => {
        if (searchText == '')
            setFilterData(employees)
        else {
            let nameRe = new RegExp(`\\b.*${searchText}.*\\b`, 'i')
            setFilterData(employees.filter(i => nameRe.test(i.name)))
        }
    }, [searchText])

    const saveEmployee = async data => {
        data.avail = data.avail ? 1 : 0
        if (getValues('id') == '') {
            data = { ...data, id: uuidv4() }
            setEmployees(prev => ([...prev, data]))
            setFilterData(prev => ([...prev, data]))
        } else {
            let updatedData = employees.map(i => i.id == getValues('id') ? i = data : i)
            setEmployees(prev => (updatedData))
            setFilterData(updatedData)
        }
        setEmpModal(false)
        toast(getValues('id') == '' ? 'Added successfully' : 'Updated successfully')
    }

    return <>
        <SiteNavbar />
        {isDomLoaded && <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="question-dashboard">

                        <div className="row">
                            <div className="col-md-3">
                                <div className="card mt-4 mb-3 mb-md-4">
                                    <div className="card-body p-3">
                                        <h5 className="text-secondary mb-2">Available: <span className="font-weight-bold ml-1 text-dark">{employees.filter(i => i.avail == 1).length}</span></h5>
                                        <h5 className="text-secondary">Total: <span className="font-weight-bold ml-1 text-dark">{employees.length}</span>
                                        </h5>

                                        <button onClick={() => {
                                            setEmpModal(true)
                                            setValue('id', '')
                                            setValue('name', '')
                                            setValue('gender', '')
                                            setValue('age', '')
                                            setValue('designation', '')
                                            setValue('dept', '')
                                            setValue('joinDate', '')
                                            setValue('avail', 1)
                                        }} className="btn btn-primary mt-4">
                                            <i className="fa fa-plus"></i>&nbsp; Add Employee</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" className="form-control" placeholder="Search by Name" />
                                    </div>
                                    <div className="col-md-2">
                                        {searchText != '' ? <button onClick={() => setSearchText('')} className="btn btn-danger">Clear</button> : null}
                                    </div>
                                </div>
                                <div className="table-responsive mt-3 mt-md-4 mb-2">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Gender</th>
                                                <th>Age</th>
                                                <th>Designation</th>
                                                <th>Department</th>
                                                <th>Joining Date</th>
                                                <th>Available</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filterData.length > 0 ? filterData.map((emp, key) => <tr key={key}>
                                                <td>{emp.name}</td>
                                                <td>{emp.gender}</td>
                                                <td>{emp.age}</td>
                                                <td>{emp.designation}</td>
                                                <td>{depts.filter(i => i.id == emp.dept)[0].name}</td>
                                                <td>{emp.joinDate}</td>
                                                <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input onChange={() => {
                                                            let updatedData = employees.map(i => ({ ...i, avail: i.id == emp.id ? !emp.avail : i.avail }))
                                                            setEmployees(prev => (updatedData))
                                                            let newupdatedData = filterData.map(i => ({ ...i, avail: i.id == emp.id ? !emp.avail : i.avail }))
                                                            setFilterData(prev => (newupdatedData))
                                                            toast('Updated successfully')
                                                        }} type="checkbox" className="custom-control-input" id={"customCheck" + key} checked={emp.avail} />
                                                        <label className="custom-control-label" htmlFor={"customCheck" + key}></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button onClick={() => {
                                                        setEmpModal(true)
                                                        setValue('id', emp.id)
                                                        setValue('name', emp.name)
                                                        setValue('gender', emp.gender)
                                                        setValue('age', emp.age)
                                                        setValue('designation', emp.designation)
                                                        setValue('dept', emp.dept)
                                                        setValue('joinDate', emp.joinDate)
                                                        setValue('avail', emp.avail)
                                                        setSearchText('')
                                                    }} type="button" className="btn btn-outline-info btn-sm">
                                                        <i className="fa fa-edit"></i>&nbsp; Edit
                                                    </button>
                                                    <button onClick={() => {
                                                        setEmployees(() => (employees.filter(i => i.id != emp.id)))
                                                        setFilterData(() => (filterData.filter(i => i.id != emp.id)))
                                                        toast('Deleted successfully')
                                                    }} type="button" className="btn btn-outline-danger btn-sm ml-2">
                                                        <i className="fa fa-trash"></i>&nbsp; Delete
                                                    </button>
                                                </td>
                                            </tr>) : <tr><td className="text-center" colSpan={5}>No records found!</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>}
        <Modal show={empModal} onHide={() => setEmpModal(false)}>
            <form onSubmit={handleSubmit(saveEmployee)}>
                <Modal.Header>
                    <Modal.Title>{getValues('id') > 0 ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="name">Name</label>
                            <input {...register('name', {
                                required: "Name is required!"
                            })} type="text" className={"form-control" + (errors?.name?.message ? ' is-invalid' : '')} placeholder="Enter name" />
                            <div className="invalid-feedback">{errors?.name?.message}</div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="gender">Gender</label>
                            <select {...register('gender', {
                                required: "Gender is required!"
                            })} className={"form-control" + (errors?.gender?.message ? ' is-invalid' : '')}>
                                <option value="">-- SELECT --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <div className="invalid-feedback">{errors?.gender?.message}</div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="age">Age</label>
                            <input  {...register('age', {
                                required: "Age is required!",
                                validate: val => /\d+/gi.test(val) || 'Age must be numeric'
                            })} type="text" className={"form-control" + (errors?.age?.message ? ' is-invalid' : '')} placeholder="Enter age" maxLength={2} />
                            <div className="invalid-feedback">{errors?.age?.message}</div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="designation">Designation</label>
                            <input  {...register('designation', {
                                required: "Designation is required!"
                            })} type="text" className={"form-control" + (errors?.designation?.message ? ' is-invalid' : '')} placeholder="Enter designation" />
                            <div className="invalid-feedback">{errors?.designation?.message}</div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="dept">Department</label>
                            <select  {...register('dept', {
                                required: "Department is required!"
                            })} className={"form-control" + (errors?.dept?.message ? ' is-invalid' : '')}>
                                <option value="">-- SELECT --</option>
                                {
                                    depts.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)
                                }
                            </select>
                            <div className="invalid-feedback">{errors?.dept?.message}</div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="joinDate">Joining Date</label>
                            <input {...register('joinDate', {
                                required: "Joining Date is required!"
                            })} type="date" className={"form-control" + (errors?.joinDate?.message ? ' is-invalid' : '')} />
                            <div className="invalid-feedback">{errors?.joinDate?.message}</div>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="avail"><input id="avail" {...register('avail')} type="checkbox" className="mr-2" /> Availability</label>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setEmpModal(false)} type="button">
                        Cancel
                    </button>
                    <button className="btn btn-primary" type="submit">
                        Save
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    </>
}