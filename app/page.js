'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const categories = ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Meat', 'Other'];

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState('');
  const [category, setCategory] = useState('Fruits');

  // Fetch inventory items from Firestore
  const updateInventory = async () => {
    try {
      const inventoryRef = collection(firestore, 'inventory');
      const snapshot = await getDocs(inventoryRef);
      const inventoryList = snapshot.docs.map((doc) => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory: ', error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // Add item to inventory
  const addItem = async () => {
    if (!itemName || !quantity || !expirationDate) {
      console.error('Please fill out all fields');
      return;
    }
    try {
      const docRef = doc(firestore, 'inventory', itemName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingItem = docSnap.data();
        const updatedQuantity = existingItem.quantity + quantity;
        await setDoc(docRef, { ...existingItem, quantity: updatedQuantity }, { merge: true });
      } else {
        await setDoc(docRef, { quantity, expirationDate, category });
      }
      console.log('Item added successfully');
      await updateInventory();
      setItemName('');
      setQuantity(1);
      setExpirationDate('');
      setCategory('Fruits');
      handleClose();
    } catch (error) {
      console.error('Error adding item: ', error);
    }
  };

  // Remove item from inventory
  const removeItem = async (itemName) => {
    try {
      const docRef = doc(firestore, 'inventory', itemName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
        }
        await updateInventory();
      }
    } catch (error) {
      console.error('Error removing item: ', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
      p={3}
    >
      <Typography variant="h2" textAlign="center">
        Pantry Tracker
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="add-item-modal">
        <Box sx={style}>
          <Typography id="add-item-modal" variant="h6">
            Add Item
          </Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
          <TextField
            label="Expiration Date (MM/DD/YY)"
            type="text"
            variant="outlined"
            fullWidth
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={addItem}>
            Add
          </Button>
        </Box>
      </Modal>
      <Box width="800px" border="1px solid #333">
        <Box
          width="100%"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h4" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack spacing={2} p={2} maxHeight="300px" overflow="auto">
          {inventory.map(({ name, quantity, expirationDate, category }) => (
            <Box
              key={name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              bgcolor="#f0f0f0"
              borderRadius="4px"
            >
              <Box>
                <Typography variant="h6" color="#333">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body2" color="#333">
                  Quantity: {quantity}
                </Typography>
                <Typography variant="body2" color="#333">
                  Expiration Date: {expirationDate}
                </Typography>
                <Typography variant="body2" color="#333">
                  Category: {category}
                </Typography>
              </Box>
              <Button variant="contained" color="secondary" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
    