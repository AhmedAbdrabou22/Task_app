import { useEffect, useState } from "react";
import { database } from "./config";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { IoMdAddCircle } from "react-icons/io";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl, InputLabel, Input, FormHelperText } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { HiDotsVertical } from "react-icons/hi";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import MapComponent from "./Map";
import MapWithMarker from "./Map";

function App() {
  //Edit Modal 
  const [editOpen, setEditOpen] = React.useState(false);
  const [editShopName, setEditShopName] = React.useState('');
  const [editCodeShop, setEditCodeShop] = React.useState('');
  const [editPhoneNumber, setEditPhoneNumber] = React.useState('');
  const [editLocation, setEditLocation] = React.useState('');
  const [editingRowId, setEditingRowId] = React.useState(null);


  const handleEditClick = (row) => {
    setEditShopName(row.Shopname);
    setEditCodeShop(row.codeShop);
    setEditPhoneNumber(row.phonenumber);
    setEditingRowId(row.id);
    setEditLocation(row.loc)
    setEditOpen(true);
    handleMenuClose(); // Close the menu after clicking "Edit"
  };


  //Meun 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);



  //Function For Download Menu In Modal

  const handleMenuClick = (event, id) => {
    console.log('Data');
    setAnchorEl(event.currentTarget);
    setSelectedRow(id);
    const selectedItem = val.find(item => item.id === id);
    setEditShopName(selectedItem.Shopname);
    setEditCodeShop(selectedItem.codeShop);
    setEditPhoneNumber(selectedItem.phonenumber);
    setEditLocation(selectedItem.loc)
  };

  const handleEditSave = async () => {
    // Update the data in Firebase
    await updateDoc(doc(value, editingRowId), {
      Shopname: editShopName,
      codeShop: editCodeShop,
      phonenumber: editPhoneNumber,
      loc : editLocation
    });

    // Update the local state with the edited data
    setVal(prevVal =>
      prevVal.map(row =>
        row.id === editingRowId
          ? { ...row, Shopname: editShopName, codeShop: editCodeShop, phonenumber: editPhoneNumber , loc:editLocation }
          : row
      )
    );

    // Close the edit modal
    setEditOpen(false);
  };

  const handleEditCancel = () => {
    // Reset the edit modal state
    setEditShopName('');
    setEditCodeShop('');
    setEditPhoneNumber('');
    setEditingRowId(null);
    setEditOpen(false);
    setEditLocation('')
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleMenuItemClick = async (id, action) => {
    if (action === 'edit') {
      const selectedRow = val.find(row => row.id === id);
      setEditShopName(selectedRow.Shopname);
      setEditCodeShop(selectedRow.codeShop);
      setEditPhoneNumber(selectedRow.phonenumber);
      setEditingRowId(id);
      setEditOpen(true);
      setEditLocation(selectedRow.loc)
    } else if (action === 'delete') {
      // Handle delete logic
      // Delete the item from Firebase
      await deleteDoc(doc(value, id));

      // Update the local state to reflect the deletion
      setVal((prevVal) => prevVal.filter((item) => item.id !== id));
    }

    handleMenuClose();
  };



  //Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  //Style Modal
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: "10px"
  };

  //Data in Modal

  const [shopName, setShopname] = useState('');
  const [codeShop, setCodeShop] = useState('');
  const [phonenumber, setPhoneNumber] = useState(0);
  const [val, setVal] = useState([]);


  //Firebase Connection 
  const value = collection(database, "demo");


  // Post Data To Firebase and  Close Modal

  const handleShop = async () => {
    const docRef = await addDoc(value, {
      Shopname: shopName,
      codeShop: codeShop, phonenumber: phonenumber,
      loc: location
    });
    setVal((prevVal) => [...prevVal, { id: docRef.id, Shopname: shopName, codeShop: codeShop, phonenumber: phonenumber , loc:location }]);

    setShopname("");
    setCodeShop("");
    setPhoneNumber('');
    setLocation('');
    handleClose();
  }



  //get All Data From Firebase

  useEffect(() => {
    const getData = async () => {
      const dbValues = await getDocs(value)
      setVal(dbValues.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }
    getData();
  }, [value])



  //Map 
  const [location, setLocation] = useState('');


  const handleClick = async (event) => {
    const { latlng } = event;
    const lat = latlng.lat;
    const lng = latlng.lng;
    console.log(lat, lng);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();

      const locationName = data.display_name;
      console.log(locationName);
      setLocation(locationName);
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  const edithandleClick = async (event) => {
    const { latlng } = event;
    const lat = latlng.lat;
    const lng = latlng.lng;
    console.log(lat, lng);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();

      const locationName = data.display_name;
      console.log(locationName);
      setEditLocation(locationName);
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };


  //Show Map InPage


  const [lat ,setLat] = useState('');
  const [lng ,setLang] = useState('');

  return (
    <div className="App font">

      <div>
        <p>Shops Managment <span className="addShop" onClick={handleOpen}><IoMdAddCircle /> Add Shop</span></p>
      </div>


        {/* Map To Show Location Shops */}
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3321794215653!2d-122.00639707560632!3d37.3346437720996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb596e9e188fd%3A0x3b0d8391510688f0!2sApple%20Park!5e0!3m2!1sar!2seg!4v1705170617655!5m2!1sar!2seg" width="100%" height="450"  loading="lazy" ></iframe>

        {/* Map To Show Location Shops */}




      {/* Modal For Add Shops With Name and Code And phone and Location  */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography style={{ textAlign: "center" }} id="modal-modal-title" variant="h6" component="h2">
            Add a New Shop
          </Typography>

          <div style={{ height: '500px', width: '100%', overflow: 'hidden' }}>
            <MapContainer center={[24.7136, 46.6753]} zoom={10} style={{ height: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <ClickHandler onClick={handleClick} />
            </MapContainer>
          </div>

          <Typography id="modal-modal-description" style={{ margin: "30px auto", textAlign: "center" }}>
            <FormControl>
              <InputLabel htmlFor="shopName">Shop Name</InputLabel>
              <Input onChange={(e) => setShopname(e.target.value)} value={shopName} id="shopName" aria-describedby="shopName-helper-text" />
            </FormControl>
            <FormControl style={{ marginLeft: "10px" }}>
              <InputLabel htmlFor="Code">Shop Code</InputLabel>
              <Input onChange={(e) => setCodeShop(e.target.value)} value={codeShop} id="Code" aria-describedby="Code-helper-text" />
            </FormControl>

            <FormControl style={{ marginLeft: "10px" }}>
              <InputLabel htmlFor="Number">Phone Number</InputLabel>
              <Input onChange={(e) => setPhoneNumber(e.target.value)} value={phonenumber} id="Number" aria-describedby="Number-helper-text" />
            </FormControl>
          </Typography>
          <div style={{ margin: "auto", textAlign: "center", width: "25%" }}>
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={handleShop}>Add</Button>
              <Button variant="outlined">Cancel</Button>
            </Stack>
          </div>
        </Box>
      </Modal>


      {/* Table To Show */}
      <TableContainer style={{ marginTop: "50px" }}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Shop Name</TableCell>
              <TableCell>Shop Code</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {val.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.Shopname}
                </TableCell>
                <TableCell>{row.codeShop}</TableCell>
                {/* <TableCell>{row.langtiud} - {row.latitude}</TableCell> */}
                <TableCell>{row.loc}</TableCell>
                <TableCell>{row.phonenumber}</TableCell>
                <TableCell>
                  <HiDotsVertical onClick={(e) => handleMenuClick(e, row.id)} />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRow === row.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleEditClick(row)}>
                      Edit
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick(row.id, 'delete')}>
                      Delete
                    </MenuItem>
                    {/* Add more menu items as needed */}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>




      {/* Edit Modal */}
      <Modal
        open={editOpen}
        onClose={handleEditCancel}
        aria-labelledby="modal-edit-title"
        aria-describedby="modal-edit-description"
      >
        <Box sx={style}>
          <Typography style={{ textAlign: "center" }} id="modal-edit-title" variant="h6" component="h2">
            Edit Shop
          </Typography>
          <div style={{ height: '500px', width: '100%', overflow: 'hidden' }}>
            <MapContainer center={[24.7136, 46.6753]} zoom={10} style={{ height: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <ClickHandler onClick={edithandleClick} />
            </MapContainer>
          </div>
          <Typography id="modal-edit-description" style={{ margin: "30px auto", textAlign: "center" }}>
            <FormControl>
              <InputLabel htmlFor="editShopName">Shop Name</InputLabel>
              <Input onChange={(e) => setEditShopName(e.target.value)} value={editShopName} id="editShopName" aria-describedby="editShopName-helper-text" />
            </FormControl>
            <FormControl style={{ marginLeft: "10px" }}>
              <InputLabel htmlFor="editCode">Shop Code</InputLabel>
              <Input onChange={(e) => setEditCodeShop(e.target.value)} value={editCodeShop} id="editCode" aria-describedby="editCode-helper-text" />
            </FormControl>

            <FormControl style={{ marginLeft: "10px" }}>
              <InputLabel htmlFor="editNumber">Phone Number</InputLabel>
              <Input type="number" onChange={(e) => setEditPhoneNumber(e.target.value)} value={editPhoneNumber} id="editNumber" aria-describedby="editNumber-helper-text" />
            </FormControl>
          </Typography>
          <div style={{ margin: "auto", textAlign: "center", width: "25%" }}>
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={handleEditSave}>Save</Button>
              <Button variant="outlined" onClick={handleEditCancel}>Cancel</Button>
            </Stack>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

const ClickHandler = ({ onClick }) => {
  const map = useMapEvents({
    click: onClick,
  });

  return null;
};

export default App;
