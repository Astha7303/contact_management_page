import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, Select, MenuItem, Typography } from "@mui/material";
import './ModalPopup.css'
import { Grid } from "@mui/system";

const ModalPopup = ({ open, handleClose, onAddContact }) => {
    const departments = ["Sales", "Support", "Engineering"];
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        department: "Sales",
        company: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newContact = {
            name: `${formData.firstName} ${formData.lastName}`,
            department: formData.department,
            company: formData.company,
            phoneNumber: formData.phone,
            email: formData.email,
            address: formData.address,
            notes: formData.notes,
            isStarred: false,
            avatar: `https://i.pravatar.cc/40?u=${formData.email}`, // random avatar based on email
            id: Math.random().toString(36).substring(2, 6)
        };

        try {
            const response = await fetch("https://contact-management-page.onrender.com/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newContact),
            });
            if (response.ok) {
                const addedContact = await response.json();
                onAddContact(addedContact);
                console.log("Contact added successfully:", addedContact);
                handleClose();
                setFormData({
                    firstName: "",
                    lastName: "",
                    department: "Sales",
                    company: "",
                    phone: "",
                    email: "",
                    address: "",
                    notes: "",
                });
            } else {
                const errorText = await response.text();
                console.error("Failed to add contact:", errorText);
            }
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper', boxShadow: 24, borderRadius: 2, color: '#2a3547', height: '90%'
            }}>
                <Typography className="new-contact">Add New Contact</Typography>
                <Box sx={{ padding: '20px 24px', paddingTop: 0, maxWidth: 600, overflow: 'auto', height: '80%', fontWeight: 400, fontSize: '0.875rem' }}>
                    <Typography sx={{ mb: 2 }} className="text-styles">
                        Let's add a new contact for your application. Fill in all the fields and click on the submit button.
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} >
                            <Grid item sm={6} xs={12}>
                                <Typography className="field-styles">First Name</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Typography className="field-styles">Last Name</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid container sm={6} xs={12}>
                                <Typography className="field-styles">Department</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    name="department"
                                    defaultValue="Sales"
                                    onChange={handleChange}
                                    value={formData.department}
                                >
                                    {departments.map((dept) => (
                                        <MenuItem className="field-styles" key={dept} value={dept}>
                                            {dept}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Typography className="field-styles">Company</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Typography className="field-styles">Phone</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Typography className="field-styles">Email</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item size={12} xs={12}>
                                <Typography className="field-styles">Address</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item size={12} xs={12}>
                                <Typography className="field-styles">Notes</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid container spacing={2}>
                                <Button xs={12} variant="contained" sx={{ mt: 2, bgcolor: '#5D87FF' }} type="submit">Submit</Button>
                                <Button xs={12} variant="contained" sx={{ mt: 2, bgcolor: '#FA896B' }} onClick={handleClose}>Cancel</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalPopup;
