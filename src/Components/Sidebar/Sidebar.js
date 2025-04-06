import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import ModalPopup from '../Modal/ModalPopup';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Sidebar = ({ filter, onSelectContact }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!selectedContact) return;
    const updatedContact = {
      ...selectedContact,
      name: `${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      department: formData.department,
      company: formData.company,
      phoneNumber: formData.phone,
      email: formData.email,
      address: formData.address,
      notes: formData.notes,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/contacts/${selectedContact.id}`,
        updatedContact
      );
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContact.id ? updatedContact : contact
        )
      );
      setSelectedContact(updatedContact);
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const editDetail = () => {
    setIsEdit(true)
    if (selectedContact) {
      const nameParts = selectedContact.name ? selectedContact.name.split(" ") : [];
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts[1] || "",
        department: selectedContact.department || "",
        company: selectedContact.company || "",
        phone: selectedContact.phoneNumber || "",
        email: selectedContact.email || "",
        address: selectedContact.address || "",
        notes: selectedContact.notes || "",
        isStarred: selectedContact.isStarred
      });
    }
  }
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/contacts');
      setContacts(response.data);
      console.log("Fetched contacts:", response.data.length, response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const toggleStar = async (id, currentStarredStatus) => {
    if (!selectedContact) return;

    const updatedContact = {
      ...selectedContact,
      isStarred: !selectedContact.isStarred,
    };
    try {
      await axios.put(
        `http://localhost:5000/contacts/${selectedContact.id}`,
        updatedContact
      );
      setSelectedContact(updatedContact);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === updatedContact.id ? updatedContact : contact
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const deleteItem = async (contactId) => {
    try {
      await axios.delete(`http://localhost:5000/contacts/${contactId}`);
      setContacts((prevContacts) => prevContacts.filter((c) => c.id !== contactId));
      if (selectedContact?.id === contactId) setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  const handleAddContact = (newContact) => {
    setContacts((prev) => [...prev, newContact]);
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      (contact.name && contact.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.position && contact.position.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter =
      selectedFilter === 'all' ? true :
        selectedFilter === 'starred' ? contact.isStarred :
          selectedFilter === 'engineers' ? contact.department == 'Engineering' :
            contact.department?.toLowerCase() === selectedFilter;

    return matchesSearch && matchesFilter;
  });


  const SidebarContent = (
    <Box sx={{ width: 270 }}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#5D87FF',
          margin: '24px 20px 16px 20px',
          color: '#FFFFFF',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 400,
        }}
        onClick={() => setOpen(true)}
      >
        Add new Contact
      </Button>
      <ModalPopup open={open} onAddContact={handleAddContact} handleClose={() => setOpen(false)} />

      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSelectedFilter('all')}>
            <ListItemIcon><InboxOutlinedIcon /></ListItemIcon>
            <ListItemText primary="All Contacts" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSelectedFilter('starred')}>
            <ListItemIcon><NearMeOutlinedIcon /></ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSelectedFilter('pending')}>
            <ListItemIcon><EventNoteOutlinedIcon /></ListItemIcon>
            <ListItemText primary="Pending" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSelectedFilter('blocked')}>
            <ListItemIcon><InfoOutlinedIcon /></ListItemIcon>
            <ListItemText primary="Blocked" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography fontWeight={700} fontSize={12} mb={1} color='#2A3547'>Categories</Typography>
        <List>
          {['Engineers', 'Support Staff', 'Sales Team', 'Developer Team'].map((Categories, i) => (
            <ListItem disablePadding key={Categories}>
              <ListItemButton onClick={() => setSelectedFilter(Categories.toLowerCase())}>
                <ListItemIcon>
                  <BookmarksOutlinedIcon sx={{
                    color: ['#539bff', '#ffae1f', '#13deb9', '#fa896b'][i]
                  }} />
                </ListItemIcon>
                <ListItemText primary={Categories} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box component="nav" sx={{ width: { md: 270 }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: 270, boxSizing: 'border-box' },
          }}
        >
          {SidebarContent}
        </Drawer>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 1,
            backgroundColor: '#fff',
            borderBottom: '1px solid #eee',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} edge="start">
              <MenuIcon />
            </IconButton>
          )}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: '8px',
              px: 1,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <SearchOutlinedIcon color="action" />
            <InputBase
              placeholder="Search Contacts"
              sx={{ ml: 1, flex: 1 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: 0,
          }}
        >
          {(!isMobile || !selectedContact) && (
            <Box
              sx={{
                width: { xs: '100%', md: '50%', lg: '35%' },
                overflowY: 'auto',
                px: 2,
                py: 2,
                borderRight: '1px solid #eee',
              }}
            >
              <List>
                {filteredContacts.map((contact) => (
                  <ListItem key={contact.id} sx={{ cursor: 'pointer' }}>
                    <ListItemAvatar><Avatar src={contact.avatar} /></ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontSize: '14px', color: '#2A3547', fontWeight: 600 }}>{contact.name}</Typography>}
                      secondary={<Typography sx={{ fontSize: '12px', color: '#2A354799', fontWeight: 400 }}>{contact.department}</Typography>}
                      onClick={() => setSelectedContact(contact)}
                    />
                    <IconButton onClick={() => toggleStar(contact.id, contact.isStarred)}>
                      {contact.isStarred
                        ? <StarIcon sx={{ color: '#ffae1f' }} />
                        : <StarBorderIcon sx={{ color: '#ffae1f' }} />}
                    </IconButton>
                    <IconButton onClick={() => deleteItem(contact.id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {selectedContact && !isEdit && (
            <Box
              sx={{
                width: { xs: '100%', md: '50%', lg: '35%' },
                p: 2,
                overflowY: 'auto',
                borderLeft: { lg: '1px solid #eee' },
                display: { xs: selectedContact ? 'block' : 'none', md: 'block' },
              }}
            >
              {isMobile && (
                <Button variant="text" onClick={() => setSelectedContact(null)} sx={{ mb: 2 }}>
                  ← Back
                </Button>
              )}
              <Grid size={12} sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Box >
                  <Typography fontWeight={600} fontSize={18} color='#2A3547'>Contact Details</Typography>
                </Box>
                <Box>
                  <IconButton onClick={toggleStar}>
                    {(selectedContact && selectedContact.isStarred) ?
                      <StarIcon sx={{ color: "rgb(255, 174, 31)" }} />
                      : <StarBorderIcon />}
                  </IconButton>
                  <IconButton onClick={() => editDetail()}><EditIcon /></IconButton>
                  <IconButton onClick={() => deleteItem(selectedContact.id)}><DeleteIcon /></IconButton>
                </Box>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} size={12} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar src={selectedContact.avatar} sx={{ width: 56, height: 56 }} />
                  <Box>
                    <Typography fontWeight={600}>{selectedContact.name}</Typography>
                    <Typography color="textSecondary" sx={{ fontSize: '14px', fontWeight: 400 }}>{selectedContact.department}</Typography>
                    <Typography color="textSecondary" sx={{ fontSize: '14px', fontWeight: 400 }}>{selectedContact.company}</Typography>
                  </Box>
                </Grid>

                <Grid container spacing={{ xs: 2, sm: 3, md: 5 }} columns={12}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary"
                      sx={{ fontSize: '12px', fontWeight: 400 }}>Phone</Typography>
                    <Typography sx={{ fontSize: '14px', color: '#2A3547', fontWeight: 600 }}>{selectedContact.phoneNumber}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary"
                      sx={{ fontSize: '12px', fontWeight: 400 }}>Email</Typography>
                    <Typography sx={{ fontSize: '14px', color: '#2A3547', fontWeight: 600 }}>{selectedContact.email}</Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary"
                    sx={{ fontSize: '12px', fontWeight: 400 }}>Address</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#2A3547', fontWeight: 600 }}>{selectedContact.address}</Typography>
                </Grid>

                <Grid container spacing={{ xs: 2, sm: 3, md: 5 }} columns={12}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary"
                      sx={{ fontSize: '12px', fontWeight: 400 }}>Department</Typography>
                    <Typography sx={{ fontSize: '14px', color: '#2A3547', fontWeight: 600 }}>{selectedContact.department}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary"
                      sx={{ fontSize: '12px', fontWeight: 400 }}>Company</Typography>
                    <Typography sx={{ fontSize: '14px', color: '#2A3547', fontWeight: 600 }}>{selectedContact.company}</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary"
                    sx={{ fontSize: '12px', fontWeight: 400 }}>Notes</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#2A3547', fontWeight: 400 }}>{selectedContact.notes}</Typography>
                </Grid>

                <Grid item xs={12} size={12} sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained"
                    sx={{ backgroundColor: '#5D87FF' }}
                    onClick={() => editDetail()}>
                    Edit
                  </Button>
                  <Button variant="contained"
                    sx={{ backgroundColor: '#FA896B' }}
                    onClick={() => deleteItem(selectedContact.id)}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {isEdit && (
            <Box sx={{
              width: { xs: '100%', md: '50%', lg: '35%' },
              display: { xs: selectedContact ? 'block' : 'none', md: 'block' },
              p: 2, flexGrow: 1, overflowY: 'auto', mt: 1, maxHeight: '80%'
            }}>
              <Grid container spacing={2}>
                <Grid item size={12}>
                  <Typography className="field-styles"
                    sx={{ fontSize: '14px', fontWeight: 600 }}>First Name</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    sx={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </Grid>
                <Grid item size={6}>
                  <Typography className="field-styles"
                    sx={{ fontSize: '14px', fontWeight: 600 }}>Last Name</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    sx={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </Grid>
                <Grid item size={6}>
                  <Typography className="field-styles"
                    sx={{ fontSize: '14px', fontWeight: 600 }}>Department</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    sx={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </Grid>

                <Grid item size={6}>
                  <Typography className="field-styles"
                    sx={{ fontSize: '14px', fontWeight: 600 }}>Company</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    sx={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </Grid>
                <Grid item size={6}>
                  <Typography className="field-styles"
                    sx={{ fontSize: '14px', fontWeight: 600 }}>Phone</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    sx={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </Grid>
                <Grid item size={6}>
                  <Typography className="field-styles"
                    sx={{ fontSize: '14px', fontWeight: 600 }}>Email</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </Grid>
                <Grid item size={12}>
                  <Typography className="field-styles"
                    sx={{ fontSize: '14px', fontWeight: 600 }}>Address</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    sx={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </Grid>
                <Grid item size={12}>
                  <Typography className="field-styles"
                    sx={{ fontSize: '14px', fontWeight: 600 }}>Notes</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    sx={{ fontSize: '14px', fontWeight: 400 }}
                  />
                </Grid>
              </Grid>
              <Button
                className='add-new-btn' variant="contained" sx={{ marginTop: '10px' }}
                onClick={() => { handleSaveChanges(); setIsEdit(false) }}>Save Contact</Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
