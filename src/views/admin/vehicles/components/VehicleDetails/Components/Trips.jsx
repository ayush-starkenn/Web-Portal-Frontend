import React from 'react'

import { Card } from 'primereact/card';
import VehicleTrips from '../../VehicleTrips';
    
        
function Trips() {
    const data = {a : 'a'}

  return (
    <div>
        <h1 className=' mt-0 px-10 '>MH 14 VP 6875</h1>
        <div className='flex flex-wrap items-center justify-left'>
                        <div className='p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 mx-2 md:mx-3'>
                            <div className='flex items-center justify-center'>
                                <i className="pi pi-car" style={{ fontSize: '1.5rem' , marginRight : '8px' }}></i>
                                <div>
                                <h3 className='text-base font-bold'>222</h3>
                                <p className='text-base'>Trips Completed</p>
                                </div>
                            </div>
                        </div>
                        <div className='p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 mx-2 md:mx-3'>
                            <div className='flex items-center justify-left'>
                            <i className="pi pi-car" style={{ fontSize: '1.5rem' , marginRight : '8px' }}></i>
                                <div>
                                <h3 className='text-base font-bold'>222</h3>
                                <p className='text-base'>Total Kms Travelled</p>
                                </div>
                            </div>
                        </div>
                        <div className='p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 mx-2 md:mx-3'>
                            <div className='flex items-center justify-left'>
                            <i className="pi pi-car" style={{ fontSize: '1.5rem' , marginRight : '8px' }}></i>
                                <div>
                                <h3 className='text-base font-bold'>222</h3>
                                <p className='text-base'>Total Duration</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center lg:justify-center p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 md:mt-3 mx-2 md:mx-3 overflow-x-scroll'>
                      <VehicleTrips myData={data}/>
                    </div>
    </div>
  )
}

export default Trips