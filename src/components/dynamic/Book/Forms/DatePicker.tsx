import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { CiCalendarDate } from "react-icons/ci";

interface DatePickerProps {
  id: string;
  value: string;
  onChange: (selectedDate: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ id, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const options: any = {
      dateFormat: 'd/m/Y',
      enableTime: false,
      defaultDate: value ? new Date(value) : null,
      onChange: (selectedDates: Date[]) => {
        onChange(selectedDates[0]);
      },
      clickOpens: true,
      touchUi: true,
      onOpen: () => {
        if (inputRef.current) {
          inputRef.current.classList.remove('placeholder-visible');
        }
      },
      onClose: () => {
        if (inputRef.current && !inputRef.current.value) {
          inputRef.current.classList.add('placeholder-visible');
        }
      },
    };

    const picker = flatpickr(inputRef.current as HTMLInputElement, options);
    const flatpickrInput = document.querySelector('.flatpickr-input');
    if (flatpickrInput) {
      flatpickrInput.classList.add(
        'outline-none',
        'border-none',
        'focus:outline-none',
        'focus:ring-0',
        'focus:shadow-none',
        'hover:shadow-none',
        'active:shadow-none'
      );
    }

    console.log('Flatpickr initialized:', picker);

    return () => {
      picker.destroy();
    };
  }, [id, value, onChange]);

  return (
    <div className='flex justify-center items-center relative'>
      <CiCalendarDate className='text-slate-800 size-5' />
      <input
        ref={inputRef}
        placeholder='Set Date'
        id={id}
        type="text"
        className="outline-none border-none focus:outline-none focus:ring-0 focus:shadow-none hover:shadow-none active:shadow-none cursor-pointer h-10 px-8 box-border placeholder-gray-600 placeholder:text-[16px] placeholder:pl-6 placeholder:opacity-80 placeholder-visible"
        style={{ height: '40px', padding: '8px' }} // Ensure consistent height and padding
      />
    </div>
  );
};

export default DatePicker;
