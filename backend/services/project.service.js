import projectModel from '../models/projectModel.js';
import mongoose from 'mongoose';

export const createProjectService = async ({
    name, userId
}) => {
    if (!name) { 
        throw new Error("Name is required");
    }
    if(!userId){
        throw new Error("User is required");
    }
    const project = await projectModel.create({
        name,
        users:[userId]
    });
    return project;
};

export const getAllProjectByUserId = async({userId})=>{
    if(!userId){
        throw new Error("UserId is required")
    }

    const alluserProjects = await projectModel.find({
        users:userId
    })
    return alluserProjects;
};

export const addUsersToProject = async ({projectId,users,userId}) =>{
    if(!projectId){
        throw new Error("project Id is required")
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid project Id");
    }
    if(!users){
        throw new Error("user are required")
    }

    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))){
        throw new Error("Invalid userId(s) in users array.");
    }
    if(!userId){
        throw new Error("user id are required")
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error("Invalid user Id");
    }

    const project = await projectModel.findOne({
        _id:projectId,
        users:userId
    })

    if(!project){
        throw new Error("User not belog to this project");
    }

    const updatedProject = await projectModel.findByIdAndUpdate({
        _id:projectId
    },{
        $addToSet:{
            users:{
                $each:users
            }
        }
    },{
        new:true
    });
    return updatedProject;

};

export const getProjectById = async({projectId})=>{
    if(!projectId){
        throw new Error("ProjectId is required");
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid Project Id");
    }
    const project = await projectModel.findOne({
        _id:projectId
    }).populate('users');
    return project;
};