import React from 'react'

import { TabView, TabPanel } from 'primereact/tabview';

import Details from './Components/Details';
import FeatureSet from './Components/FeatureSets';
import Alerts from './Components/Alerts';
import Trips from './Components/Trips';

import { BreadCrumb } from 'primereact/breadcrumb';
        

function index() {
  const items = [
    { label: 'Vehicles',
    url: 'http://localhost:3000/admin/vehicles'
   },
    {
        label: 'View'
    }
];
const home = { icon: 'pi pi-car', url: 'http://localhost:3000/admin/vehicles' };

  return (
    <div className='bg-white overflow-scroll rounded-lg'>
        <BreadCrumb model={items} home={home} className='font-bold'/>
        <TabView className='m-0 bg-white'>
            <TabPanel header='Details'>
              <Details />
            </TabPanel>

            <TabPanel header='FetureSet'>
            <FeatureSet />
            </TabPanel>

            <TabPanel header='Alerts'>
             <Alerts />
            </TabPanel>

            <TabPanel header='Trips'>
            <Trips/>
            </TabPanel>
        </TabView>
        
    </div>
  )
}

export default index;