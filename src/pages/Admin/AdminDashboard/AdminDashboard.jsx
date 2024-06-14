import React from 'react'
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader'
import FirstRow from 'src/components/Admin/Dashboard/FirstRow'
import SecondRow from 'src/components/Admin/Dashboard/SecondRow'
import ThirdRow from 'src/components/Admin/Dashboard/ThirdRow'

const AdminDashboard = () => {

  return (
    <>
      <AdminHeader browseWebsite={true} addNew={false} search={false} notification={true} profile={true} />
      <div className='font-main bg-[#F6F8F9] gap-2 p-2 '>
        {/* first row - order, sold, gross sale, total shipping cost*/}
        <FirstRow />
        {/* second row - weekly analysis*/}
        <SecondRow />
        {/* third row - recent purchase (orders) and stock out products */}
        <ThirdRow />
      </div>
    </>
  )
}

export default AdminDashboard