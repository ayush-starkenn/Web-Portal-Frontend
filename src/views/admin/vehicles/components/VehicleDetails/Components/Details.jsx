import React from 'react'

function Details() {
  return (
    <div>
        <h1 className=' mt-0 px-10 '>MH 14 VP 6875</h1>
                    <div className='flex flex-wrap items-center justify-left'>
                        <div className='p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 mx-2 md:mx-3'>
                            <div className='flex items-center justify-center'>
                                <i className="pi pi-car" style={{ fontSize: '1.5rem' , marginRight : '8px' }}></i>
                                <div>
                                <h3 className='text-base font-bold'>222</h3>
                                <p className='text-base'>Overall Kms run</p>
                                </div>
                            </div>
                        </div>
                        <div className='p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 mx-2 md:mx-3'>
                            <div className='flex items-center justify-left'>
                            <i className="pi pi-car" style={{ fontSize: '1.5rem' , marginRight : '8px' }}></i>
                                <div>
                                <h3 className='text-base font-bold'>222</h3>
                                <p className='text-base'>Overall Kms run</p>
                                </div>
                            </div>
                        </div>
                        <div className='p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 mx-2 md:mx-3'>
                            <div className='flex items-center justify-left'>
                            <i className="pi pi-car" style={{ fontSize: '1.5rem' , marginRight : '8px' }}></i>
                                <div>
                                <h3 className='text-base font-bold'>222</h3>
                                <p className='text-base'>Overall Kms run</p>
                                </div>
                            </div>
                        </div>
                        <div className='p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 mx-2 md:mx-3'>
                            <div className='flex items-center justify-left'>
                            <i className="pi pi-car" style={{ fontSize: '1.5rem' , marginRight : '8px' }}></i>
                                <div>
                                <h3 className='text-base font-bold'>222</h3>
                                <p className='text-base'>Overall Kms run</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* creating actual details of the vehicle */}
                    <div className='flex flex-wrap items-center justify-left'>
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
                    </div>

                    <h1 className='text-navy-400 font-bold mt-0 px-10 '>Documents</h1>
                    <div className='flex flex-wrap items-center justify-left'>
                        <div className='flex flex-wrap items-center justify-left p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 md:mt-3 mx-2 md:mx-3'>
                            <i className="pi pi-file-pdf" style={{ fontSize: '2rem', color: 'red' }}></i>
                            <p>Pdf file name</p>
                            
                            <i className="pi pi-cloud-download" style={{ fontSize: '2rem' , marginLeft: '60px', color: 'blue' }}></i>
                        </div>
                        <div className='flex flex-wrap items-center justify-left p-5  rounded-lg shadow-md rgba-[0,0,0,0.8] shadow-sm rgba-[0,0,0,0.24] m-3 md:m-10 md:mt-3 mx-2 md:mx-3'>
                            <i className="pi pi-file-pdf" style={{ fontSize: '2rem', color: 'red' }}></i>
                            <p>Pdf file name</p>
                            
                            <i className="pi pi-cloud-download" style={{ fontSize: '2rem' , marginLeft: '60px', color: 'blue' }}></i>
                        </div>
                    </div>
    </div>
  )
}

export default Details