import React,{useState} from 'react'

const useSearchTerm=()=>{
      const [searchTerm, setSearchTerm] = useState('')
    return{searchTerm,setSearchTerm}
}

export default useSearchTerm