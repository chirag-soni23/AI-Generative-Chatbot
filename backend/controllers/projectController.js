import projectModel from '../models/projectModel.js';
import userModel from '../models/userModel.js';
import * as projectService from '../services/project.service.js';
import { validationResult } from 'express-validator';

export const createProject = async(req,res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {name} = req.body;
        const loggedInUser = await userModel.findOne({email:req.user.email});
        const userId = loggedInUser._id;
        const newProject = await projectService.createProjectService({name,userId});
        res.status(201).json(newProject);        
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);        
    }
   
}