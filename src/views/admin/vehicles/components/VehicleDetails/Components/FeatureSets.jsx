import React , {useState, useRef} from 'react'
import { Button } from 'primereact/button';

import { Toast } from 'primereact/toast';
        
import EditFeatureset from './EditFeatureset';
    
import { Dialog } from 'primereact/dialog';
        
function FeatureSets() {
    //pi-lock
    //pi-lock-open
    const [myData , setData] = useState({
        traveltime : "20hrs",
        travelDistance: "20kms",
        fuelIndication : "30%"
    })
    const toastRef = useRef(null);
    const [checked, setChecked] = useState(false);
    const handleEditSuccess = () => {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Feature Set updated successfully`,
          life: 3000,
        });
        setFs(myData);
      };

      const setFs = (values)=>{console.log(values)}
  return (
    <div>
        
        <h1 className=' mt-0 px-10 '>MH 14 VP 6875</h1>
        <div className='p-5 m-3 md:m-10 mx-2 md:mx-3'>
        {!checked ? (<Button label="Edit" style={{background: 'lightgreen', padding : '10px'}} icon="pi pi-lock-open" onClick={()=>{setChecked(true)}}/>) : (<Button label="Lock" style={{background: '#FF7F7F', padding : '10px'}} icon="pi pi-lock" onClick={()=>{setChecked(false)}}/>)}
        </div>

        {/* actual feature set values */}
        {!checked ? (<div className='flex flex-wrap items-center justify-left'>
                        <div className='flex flex-wrap items-center justify-left p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 md:mt-3 mx-2 md:mx-3'>
                            <div className='min-w-[200px] m-2 !mb-4'>
                                <h3 className='font-bold text-base'>Key</h3>
                                <p className='text-base'>Value</p>
                            </div>
                            <div className='min-w-[200px] m-2 !mb-4'>
                                <h3 className='font-bold text-base'>Key</h3>
                                <p className='text-base'>Value</p>
                            </div>
                            <div className='min-w-[200px] m-2 !mb-4'>
                                <h3 className='font-bold text-base'>Key</h3>
                                <p className='text-base'>Value</p>
                            </div>
                            <div className='min-w-[200px] m-2 !mb-4'>
                                <h3 className='font-bold text-base'>Key</h3>
                                <p className='text-base'>Value</p>
                            </div>
                            <div className='min-w-[200px] m-2 !mb-4'>
                                <h3 className='font-bold text-base'>Key</h3>
                                <p className='text-base'>Value</p>
                            </div>
                            <div className='min-w-[200px] m-2 !mb-4'>
                                <h3 className='font-bold text-base'>Key</h3>
                                <p className='text-base'>Value</p>
                            </div>
                            <div className='min-w-[200px] m-2 !mb-4'>
                                <h3 className='font-bold text-base'>Key</h3>
                                <p className='text-base'>Value</p>
                            </div>
                            <div className='min-w-[200px] m-2 !mb-4'>
                                <h3 className='font-bold text-base'>Key</h3>
                                <p className='text-base'>Value</p>
                            </div>
                            <div className='min-w-[200px] m-2 !mb-4'>
                                <h3 className='font-bold text-base'>Key</h3>
                                <p className='text-base'>Value</p>
                            </div>
                        </div>
                    </div>): (
                        <div className='flex flex-wrap items-center justify-left p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 md:mt-3 mx-2 md:mx-3 w-[100%]'>
                            
                            <EditFeatureset parameters={{ propValue: myData }}
          onSuccess={handleEditSuccess} />
                        </div>
                    )}
    </div>
  )
}

export default FeatureSets