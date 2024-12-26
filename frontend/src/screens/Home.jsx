import React, { useEffect, useState } from 'react';
import axios from '../config/axios.js';
// import { useUser } from '../context/user.context';

const Home = () => {
  // const { user } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [project,setProject] = useState([])

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  function createProject(e) {
    e.preventDefault();
    axios.post('/project/create', { name: projectName }).then((res) => { console.log(res), setIsModalOpen(false).setProjectName("") }).catch((error) => {
      console.log(error)
    })
    console.log(projectName);
  }

  useEffect(()=>{
    axios.get('/project/all').then((res)=>{
      setProject(res.data.projects);

    }).catch((err)=>{
      console.log(err)
    })
  },[])

  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-3">
        <button onClick={toggleModal} className="project p-4 border border-slate-300 rounded-md cursor-pointer">
          New Project <i className="ri-links-line ml-1"></i>
        </button>
        {
          project.map((project)=>{
            return <div key={project._id} className='p-4 border border-slate-300 flex flex-col gap-2 rounded-md cursor-pointer min-w-52 hover:bg-slate-100'>
              <h2 className='font-semibold'>{project.name}</h2>
              <div className='flex gap-2'>
             <p> <i className="ri-user-line"></i> <small>Collaborators:</small></p>
                {project.users.length}
              </div>
            </div>
          })
        }
      </div>

      {/* Modal - This will show when isModalOpen is true */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4">
            <h2 className="text-xl font-bold mb-4">Create a New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  type="text"
                  required
                  id="projectName"
                  className="mt-1 p-2 border border-slate-300 rounded-md w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md"
              >
                Create Project
              </button>
            </form>
            <button
              onClick={toggleModal}
              className="mt-4 w-full text-center p-2 bg-gray-300 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
