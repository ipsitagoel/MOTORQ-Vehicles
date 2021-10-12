import React,{useState, useEffect, useRef} from 'react'
import {motion} from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import './Vehicles.css'


function Vehicles() {
    const PAGE_NUMBER = 1;
    const [dataFetch, updateDataFetch] = useState([]);
    const [editClicked, updateEditClicked] = useState(false);
    const [toEditKey, updateToEditKey] = useState();
    const [toEditVin, updateToEditVin] = useState();
    const [vCount, updateVCount] = useState(1);
    const [searched,updateSearched] = useState(false);
    const [page, setPage] = useState(PAGE_NUMBER);
    const [totalLength, updateTotalLength] = useState(0);
    const [selectSearch, updateSelectSearch] = useState("");
    const vinRef = useRef(null);
    const licenceRef = useRef(null);
    const driverRef = useRef(null);
    const customerRef = useRef(null);
    const officeRef = useRef(null);
    const vinSearchRef = useRef(null);
    const licenceSearchRef = useRef(null);
    const driverSearchRef = useRef(null);
    const countRef = useRef(null);
    const selectSearchRef = useRef(null);
    useEffect(() => {
        console.log('useeffect called')
        fetch(`https://motorq-vehicles.herokuapp.com/api/vehicles?count=8`)
        .then(res => res.json().then( (result) => { updateDataFetch(dataFetch.concat(result.vehicles)); updateTotalLength(result.noOfEntries) }))
        console.log(dataFetch)
    },[page]);
    const callEdit = (vin,key) => {
        updateEditClicked(true);
        updateToEditKey(key);
        updateToEditVin(vin);
        console.log(vin,key)
    }
    const callSave = async (vin,licence,driver,customer,office) => {
        let data = { 'vin': vin,'licence': licence, 'driver': driver, 'customer': customer, 'office': office }
        const response = await fetch("https://motorq-vehicles.herokuapp.com/api/vehicles/"+vin, {
            method: 'PATCH',
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(data)
          });
          //console.log(response.json().then((result) => console.log(result))) 
        updateEditClicked(false);
        updateToEditKey(null);
    }
    const search = (att,val) => {
        updateSearched(true)
        fetch(`https://motorq-vehicles.herokuapp.com/api/vehicles?${att}=${val}`)
        .then(res => res.json().then( (result) => updateDataFetch(result.vehicles)))
        //console.log(att,val,dataFetch)
    }
    const resetSearch = () => {
        updateSearched(false);
        setPage(1);
        if(vinSearchRef.current !== null) vinSearchRef.current.value = "";
        if(licenceSearchRef.current !== null) licenceSearchRef.current.value = "";
        if(driverSearchRef.current !== null) driverSearchRef.current.value = "";
        if(countRef.current !== null) countRef.current.value = "";
    }
    const fetchMoreData = () => {
        setPage(page + 1);
    }
    return (
        <div>
            <div className='vehicle-table-search'>
                <div className='vehicle-table-search-select'>
                Search using - 
                <select className='vehicle-table-search-select-inner' ref={selectSearchRef}>
                    <option className='vehicle-table-search-select-element' onClick={()=> updateSelectSearch(selectSearchRef.current.value)}>
                        Count
                    </option>
                    <option className='vehicle-table-search-select-element' onClick={()=> updateSelectSearch(selectSearchRef.current.value)}>
                        VIN
                    </option>
                    <option className='vehicle-table-search-select-element' onClick={()=> updateSelectSearch(selectSearchRef.current.value)}>
                        Driver
                    </option>
                    <option className='vehicle-table-search-select-element' onClick={()=> updateSelectSearch(selectSearchRef.current.value)}>
                        Licence
                    </option>
                </select>
                </div>
                {(selectSearch==='count') && <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.5, delay: dataFetch*0.3}} className='vehicle-table-search-element'><input type='text' ref={countRef} placeholder='select no. of vehicles'/>
                <button onClick={ () => search('count',countRef.current.value) } >Search</button>
                </motion.div>}
                {(selectSearch==='vin') && <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.5, delay: dataFetch*0.3}} className='vehicle-table-search-element'><input type='text' ref={vinSearchRef} placeholder='vin no.' />
                <button onClick={ () => search('vin',vinSearchRef.current.value) }>Search</button>
                </motion.div>}
                {(selectSearch==='driver') && <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.5, delay: dataFetch*0.3}} className='vehicle-table-search-element'><input type='text' ref={driverSearchRef} placeholder='driver name' />
                <button onClick={ () => search('driver',driverSearchRef.current.value) }>Search</button>
                </motion.div>}
                {(selectSearch==='licence') && <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.5, delay: dataFetch*0.3}} className='vehicle-table-search-element'><input type='text' ref={licenceSearchRef} placeholder='licence plate' />
                <button onClick={ () => search('plate',licenceSearchRef.current.value) }>Search</button>
                </motion.div>}
                <div><button onClick={() => resetSearch()}>Reset</button></div>
            </div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 1.5, delay: dataFetch*0.3}} className='vehicle-table'>
            {!searched && <InfiniteScroll dataLength={dataFetch.length} next={fetchMoreData} hasMore={(totalLength >= dataFetch.length)} loader={!searched && <h4>Loading...</h4>} endMessage={<h5 style={{ textAlign: "center" }}>you have seen all</h5>}>
            <table className='vehicle-table-inner'>
            <tr>
                        <th>Vehicle Identification No.</th>
                        <th>Licence Plate</th>
                        <th>Driver</th>
                        <th>Model/Make/Year</th>
                        <th>Customer</th>
                        <th>Office Name</th>
                        <th>Ignition</th>
                        <th>Speed</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        {!editClicked && <th>Edit</th>}
                        {editClicked && <th>Save</th>}
            </tr>
            {dataFetch.map( (val,key) => {
                return <tr>
                    {!(key === toEditKey) && <motion.td className='vehicle-table-element' ref={vinRef}>{val.vin}</motion.td>}
                    {(key === toEditKey) && <td className='vehicle-table-element'><input placeholder={val.vin} value={val.vin} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!(key === toEditKey) && <motion.td className='vehicle-table-element' >{val.LicencePlate}</motion.td> }
                    { (key === toEditKey) && <td className='vehicle-table-element' ><input ref={licenceRef} placeholder='new licence no.' defaultValue={val.LicencePlate}></input></td> }
                    { !(key === toEditKey) && <motion.td className='vehicle-table-element'>{val.Driver}</motion.td> }
                    { (key === toEditKey) && <td className='vehicle-table-element' ><input ref={driverRef} placeholder='new driver name' defaultValue={val.Driver}></input></td> }
                    {!(key === toEditKey) && <motion.td className='vehicle-table-element' >{val.MMY}</motion.td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.MMY} value={val.MMY} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!(key === toEditKey) && <motion.td className='vehicle-table-element'>{val.CustomerName}</motion.td> }
                    { (key === toEditKey) && <td className='vehicle-table-element' ><input ref={customerRef} placeholder='new customer name' defaultValue={val.CustomerName}></input></td> }
                    { !(key === toEditKey) && <motion.td className='vehicle-table-element'>{val.Office}</motion.td>}
                    { (key === toEditKey) && <td className='vehicle-table-element' ><input ref={officeRef} placeholder='new office name' defaultValue={val.Office}></input></td>}
                    {!(key === toEditKey) && <motion.td className='vehicle-table-element'>{val.Status.ignition}</motion.td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.Status.ignition} value={val.Status.ignition} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!(key === toEditKey) && <motion.td className='vehicle-table-element' >{val.Status.speed}</motion.td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.Status.speed} value={val.Status.speed} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!(key === toEditKey) && <motion.td className='vehicle-table-element'>{val.Status.location.lat}</motion.td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.Status.location.lat} value={val.Status.location.lat} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!(key === toEditKey) && <motion.td className='vehicle-table-element' >{val.Status.location.lon}</motion.td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.Status.location.lon} value={val.Status.location.lon} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!editClicked && <motion.td className='vehicle-table-element'><button class="edit-btn" onClick={ () => callEdit(dataFetch[key].vin,key)}>Edit</button></motion.td>}
                    {editClicked && (key === toEditKey) && <td className='vehicle-table-element' ><button class="edit-btn" onClick={ () => callSave(toEditVin,licenceRef.current.value,driverRef.current.value,customerRef.current.value,officeRef.current.value)}>Save</button></td> }
                    {editClicked && !(key === toEditKey) && <td className='vehicle-table-element' ><button class="edit-btn" onClick={ () => callEdit(dataFetch[key].vin,key)}>Edit</button></td> }
                    </tr>
            } )}
            </table>
            </InfiniteScroll>}
            { searched && <table className='vehicle-table-inner'>
            <tr>
                        <th>Vehicle Identification No.</th>
                        <th>Licence Plate</th>
                        <th>Driver</th>
                        <th>Model/Make/Year</th>
                        <th>Customer</th>
                        <th>Office Name</th>
                        <th>Ignition</th>
                        <th>Speed</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        {!editClicked && <th>Edit</th>}
                        {editClicked && <th>Save</th>}
            </tr>
            {dataFetch.map( (val,key) => {
                return <tr>
                    {!(key === toEditKey) && <td className='vehicle-table-element' ref={vinRef}>{val.vin}</td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.vin} value={val.vin} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    { !(key === toEditKey) && <td className='vehicle-table-element' >{val.LicencePlate}</td> }
                    { (key === toEditKey) && <td className='vehicle-table-element' ><input ref={licenceRef} placeholder='new licence no.' defaultValue={val.LicencePlate}></input></td> }
                    { !(key === toEditKey) && <td className='vehicle-table-element' >{val.Driver}</td> }
                    { (key === toEditKey) && <td className='vehicle-table-element' ><input ref={driverRef} placeholder='new driver name' defaultValue={val.Driver}></input></td> }
                    {!(key === toEditKey) && <td className='vehicle-table-element' >{val.MMY}</td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.MMY} value={val.MMY} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    { !(key === toEditKey) && <td className='vehicle-table-element' >{val.CustomerName}</td> }
                    { (key === toEditKey) && <td className='vehicle-table-element' ><input ref={customerRef} placeholder='new customer name' defaultValue={val.CustomerName}></input></td> }
                    { !(key === toEditKey) && <td className='vehicle-table-element' >{val.Office}</td>}
                    { (key === toEditKey) && <td className='vehicle-table-element' ><input ref={officeRef} placeholder='new office name' defaultValue={val.Office}></input></td>}
                    {!(key === toEditKey) && <td className='vehicle-table-element' >{val.Status.ignition}</td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.Status.ignition} value={val.Status.ignition} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!(key === toEditKey) && <td className='vehicle-table-element' >{val.Status.speed}</td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.Status.speed} value={val.Status.speed} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!(key === toEditKey) && <td className='vehicle-table-element' >{val.Status.location.lat}</td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.Status.location.lat} value={val.Status.location.lat} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!(key === toEditKey) && <td className='vehicle-table-element' >{val.Status.location.lon}</td>}
                    {(key === toEditKey) && <td className='vehicle-table-element' ><input placeholder={val.Status.location.lon} value={val.Status.location.lon} readonly onClick={() => {window.alert('cannot be edited')}}></input></td>}
                    {!editClicked && <td className='vehicle-table-element' ><button class="edit-btn" onClick={ () => callEdit(dataFetch[key].vin,key)}>Edit</button></td>}
                    {editClicked && (key === toEditKey) && <td className='vehicle-table-element' ><button class="edit-btn" onClick={ () => callSave(toEditVin,licenceRef.current.value,driverRef.current.value,customerRef.current.value,officeRef.current.value)}>Save</button></td> }
                    {editClicked && !(key === toEditKey) && <td className='vehicle-table-element' ><button class="edit-btn" onClick={ () => callEdit(dataFetch[key].vin,key)}>Edit</button></td> }
                    </tr>
            } )}
            </table>}
            </motion.div>
        </div>
    )
}

export default Vehicles
