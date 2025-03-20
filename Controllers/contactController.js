import Sync from "twilio/lib/rest/Sync.js";
// import Contact from "../models/contactModal.js";

// import {admindmin} from '../middlewares/roleIdentification.js';
// import {auth} from '../middlewares/tokenVerification.js';

export const CreateContact = async(requestAnimationFrame, res)=>{
    try{
        const{names, email, subject, message, phone, status} = requestAnimationFrame.body;
        const newContact = new Contact({names, email, subject, message, phone, status});

        await newContact.save();

        res.status(201).json({success: true, message:'Contact created successfully', Contact: newContact});
    }

    catch(error){
        res.status(500).json({success:false, message:'Server Error', error: error.message});

    }
}

export const getAllContact= async(req, res)=>{
    try{
        const contacts = await Contact.find();
        res.status(200).json({subject:true, contacts})
    }
    catch (error) {
        res.status(500).json({success:false, message:'Server error', error:error.message})
    }
}

export const getContactById = async(req, res) => {
    try{
        const {id} = req.params;
        const contacts =await Contact.findById(id);
        if (!contacts){
            res.status(404).json({success:false, contacts, message:'Server Error',error:error.message})
        }
        res.status(200).json({subject:true, contacts})
    }

    catch (error){
        res.status(500).json({success:false, message:'Server error', error:error.message})
    }
}

export const deleteContactById = async(req, res) => {
    try{
        const {id} = req.params;
        const contacts =await Contact.findByIdAndDelete(id);
        if (!contacts){
            res.status(404).json({success:false, contacts, message:'Server Error',error:error.message})
        }
        res.status(200).json({subject:true, contacts})
    }

    catch (error){ 
        res.status(500).json({success:false, message:'Server error', error:error.message})
    }
}