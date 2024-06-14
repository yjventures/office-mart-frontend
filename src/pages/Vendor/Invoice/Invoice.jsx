import { useAtomValue } from 'jotai'
import React, { useRef } from 'react'
import { FaPlus } from 'react-icons/fa'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import ProfileSidebar from 'src/components/Profile/ProfileSidebar/ProfileSidebar'
import { userAtom } from 'src/lib/jotai'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import InvoiceComponent from 'src/components/Vendor/Invoice/InvoiceComponent'
import sonbolaIcon from 'assets/global/sonbola.svg'
import sonbolaIconText from 'assets/constant/logo/textSonbolaBlack.svg'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const Invoice = () => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const navigate = useNavigate()
    const user = useAtomValue(userAtom)
    const pdfRef = useRef()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    const downloadInvoice = async () => {
        const input = pdfRef.current;

        try {
            // Use async/await with html2canvas
            const canvas = await html2canvas(input);

            // Create an Image element and set its source to the canvas data URL
            const img = new Image();
            img.src = canvas.toDataURL('image/png');

            // Use a Promise to wait for the image to load
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = img.width;
            const imgHeight = img.height;

            const paddingTop = 10;
            const paddingLeft = 10;

            const ratio = Math.min((pdfWidth - 2 * paddingLeft) / imgWidth, (pdfHeight - 2 * paddingTop) / imgHeight);
            const imgX = paddingLeft + (pdfWidth - 2 * paddingLeft - imgWidth * ratio) / 2;
            const imgY = paddingTop + 30;

            pdf.addImage(img, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('download.pdf');

            // The rest of your code for sending email
            const formData = new FormData();
            formData.append('file', pdf.output('blob'), 'invoice.pdf');
            formData.append('email', user.email);
            formData.append('email_subject', `Invoice for your order`);
            formData.append('email_text', `Thank you for your order. Here is your invoice.`);

            const res = await axios.post(`${import.meta.env.VITE_API_PATH}/emails/send-file-text`, formData);
            // console.log(res.data);

            if (res.status === 200) {
                showToast('Invoice sent to your email', 'success');
            } else {
                showToast('Failed to send invoice to your email', 'error');
            }
        } catch (error) {
            // console.log(error);
            showToast('Failed to generate invoice', 'error');
        }
    };


    return (
        <div className='h-full p-3 font-main lg:-ms-10 lg:-mt-4' dir={currentLanguage == 'ar' && 'rtl'}>
            <div className='lg:flex justify-between items-center relative mb-2'>
                <div className='flex items-center gap-3 my-2'>
                    <p className='font-[600] border-l-4 pl-3 border-l-emerald-600'>{t('invoice_page.title')}</p>
                </div>
                <div className={`lg:hidden absolute top-0 ${currentLanguage == 'ar' ? 'left-2' : 'right-2'}`}>
                    <IoReorderThreeOutline className='w-[20px] h-[20px]' onClick={() => {
                        setShowSidebar(!showSidebar)
                    }} />
                </div>
                <div className='lg:hidden'>
                    {
                        showSidebar && <ProfileSidebar />
                    }
                </div>

                <button
                    onClick={downloadInvoice}
                    className='border-2 hover:text-tertiary-600 flex items-center gap-1 border-tertiary-600 hover:text-primary-color px-[20px] py-[6px] rounded-[3px] text-[16px] font-[600] text-tertiary-600 bg-white transition my-4 lg:mt-0'>
                    <FaPlus className='w-3 h-3' />
                    {t('invoice_page.button')}
                </button>
            </div>
            {/* component of invoice */}
            <InvoiceComponent ref={pdfRef} />

        </div>
    )
}

export default Invoice