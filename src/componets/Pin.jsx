import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'

import {client,urlFor} from '../client'
import { userSavedPinsQuery } from '../utils/data'

const Pin = ({pin}) => {
  const [postHovered, setPostHovered] = useState(false)
  const [savingPost, setSavingPost] = useState(false)

  const navigate=useNavigate()

  const {postedBy,image,_id,destination}=pin

  const user =localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) :localStorage.clear()

  const deletePin=(id)=>{
    client.delete(id).then(()=>window.location.reload())
  }

  let alreadySaved=!!(pin?.save?.filter((item)=>item?.postedBy?._id===user?.sub))?.length
  console.log(alreadySaved)
  console.log(pin?.save?.length)
    // alreadySaved=alreadySaved?.length>0 ? alreadySaved : [] 

    const savePin =(id)=>{
      if(!alreadySaved){
        setSavingPost(true)

        client
          .patch(id)
          .setIfMissing({save:[]})
          .insert('after','save[-1]',[{
            _key:uuidv4(),
            userId:user?.sub,
            postedBy:{
              _type:'postedBy',
              _ref:user?.sub
            }
          }])
          .commit()
          .then(()=>{
            window.location.reload()
            setSavingPost(false)
          })
      }
    }


  return (
    <div className="m-2">
      <div
      onMouseEnter={()=>setPostHovered(true)}
      onMouseLeave={()=>setPostHovered(false)}
      onClick={()=>navigate(`/pin-detail/${_id}`)}
      className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      > 
      {image && 
        <img className='rounded-lg w-full' src={(urlFor(image).width(250).url())} alt='user-post' />
      }
      {
        postHovered &&
        <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
        style={{height:'100%'}}
        >
        <div className='flex items-center justify-between'>
          {/* logica de descargar foto */}
          <div className="flex gap-2">
            {/* la direccion debe de acabar en '?dl=' y especificar download */}
            <a href={`${image?.asset?.url}?dl=`}
            download 
            className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
            onClick={(e)=>{
              // esto evitara de que inicie la funcion de detalles, en si el click no pasar de la imagen de descarga
              e.stopPropagation()
            }}>
              <MdDownloadForOffline />
            </a>
          </div>
          {
            // logica de salvar el pin
            alreadySaved ?
            <button 
            onClick={(e)=>{
              e.stopPropagation()
            }}
            type='button'
            className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 
            py-1 text-base rounded-3xl hover:shadow-md outline-none flex">
              {pin?.save?.length} Saved
            </button>
            :
            <button
            onClick={(e)=>{
              e.stopPropagation()
              savePin(_id)
            }}
            type='button'   
            className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 
            py-1 text-base rounded-3xl hover:shadow-md outline-none"
            >
              {savingPost ? 'Saving' : 'Save'}
            </button>
          }
          
        </div>
        <div className="flex justify-between items-center gap-2 w-full">
            {
              destination && 
              <a href={destination} target='_blank'
              className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
              rel='noreferrer'
              onClick={(e)=>{
              e.stopPropagation()
              
            }}
              >
                <BsFillArrowUpRightCircleFill />
                { destination.length >20 ? destination?.slice(8,20) :destination?.slice(0,7) }
              </a>
         
            }
            {
              postedBy?._id===user?.sub &&
              <button 
              className="bg-white p-2 rounded-full w-8 h-8 flex items-center text-dark opacity-75 hover:opacity-100 outline-none"
              onClick={(e)=>{
                e.stopPropagation()
                deletePin(_id)
              }}
              >
                <AiTwotoneDelete />
              </button>
            }
          </div>
        </div>
      }
      </div>
      <Link
      to={`/user-profle/${postedBy?._id}`}
      className='flex gap-2 mt-2 items-center'
      >
        <img 
        src={postedBy.image} 
        className='w-8 h-8 rounded-full object-cover'
        alt="user-profile" />
        <p className="font-semibold capitalize">
          {postedBy?.userName}
        </p>
      </Link>
  </div>
  )
}

export default Pin