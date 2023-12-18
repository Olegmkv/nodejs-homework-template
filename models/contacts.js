import fs from 'fs/promises'
import path from "path"
import { nanoid } from "nanoid"

const contactsPath = path.resolve("models", "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8")
  return JSON.parse(data);
}

const getContactById = async (id) => {
    const data = await listContacts();
    const index = data.findIndex(element => element.id === id);
    if (index === -1) {
        return null;
    };
    return data[index];
}

const removeContact = async (id) => {
    const data = await listContacts();
    const index = data.findIndex(element => element.id === id);
    if (index === -1) {
        return null;
    };
    const [obj] = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return obj;
}
const addContact = async (body) => {
    const data = await listContacts();
    const { name, email, phone } = body;
    const objAdd = {
        id: nanoid(),
        name,
        email,
        phone
    };
    data.push(objAdd);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return objAdd;
}

const updateContact = async (id, body) => {
  
  const data = await listContacts();
  const index = data.findIndex(element => element.id === id);
  if (index === -1) {
        return null;
  };
  const objChange = { ...data[index], ...body }
  data[index] = objChange;
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return objChange;  
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
