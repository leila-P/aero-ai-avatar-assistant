
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingFormProps {
  conversation: Array<{type: 'user' | 'ai', message: string}>;
  onUpdateConversation: (conversation: Array<{type: 'user' | 'ai', message: string}>) => void;
}

interface BookingData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  class: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const BookingForm = ({ conversation, onUpdateConversation }: BookingFormProps) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [missingFields, setMissingFields] = useState<string[]>([]);

  const requiredFields = [
    { key: 'origin', label: 'مبدا', question: 'از کدام شهر می‌خواهید پرواز کنید؟' },
    { key: 'destination', label: 'مقصد', question: 'مقصد شما کدام شهر است؟' },
    { key: 'departureDate', label: 'تاریخ رفت', question: 'در چه تاریخی می‌خواهید پرواز کنید؟' },
    { key: 'passengers', label: 'تعداد مسافر', question: 'چند نفر مسافر خواهید داشت؟' },
    { key: 'firstName', label: 'نام', question: 'نام شما چیست؟' },
    { key: 'lastName', label: 'نام خانوادگی', question: 'نام خانوادگی شما چیست؟' },
    { key: 'email', label: 'ایمیل', question: 'آدرس ایمیل شما چیست؟' },
    { key: 'phone', label: 'تلفن', question: 'شماره تلفن شما چیست؟' }
  ];

  const checkMissingFields = () => {
    const missing = requiredFields.filter(field => {
      const value = bookingData[field.key as keyof BookingData];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    setMissingFields(missing.map(field => field.key));
    return missing;
  };

  const askForMissingField = (field: any) => {
    const newConversation = [...conversation, {
      type: 'ai' as const,
      message: field.question
    }];
    onUpdateConversation(newConversation);
  };

  useEffect(() => {
    const missing = checkMissingFields();
    if (missing.length > 0) {
      const timer = setTimeout(() => {
        askForMissingField(missing[0]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bookingData]);

  const handleInputChange = (field: string, value: string | number) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    const missing = checkMissingFields();
    if (missing.length === 0) {
      const newConversation = [...conversation, {
        type: 'ai' as const,
        message: 'اطلاعات شما کامل است! در حال جستجوی بهترین پروازها برای شما...'
      }];
      onUpdateConversation(newConversation);
    }
  };

  return (
    <div className="space-y-6">
      {/* Flight Information */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">اطلاعات پرواز</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-gray-300">مبدا</Label>
            <Input
              value={bookingData.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${missingFields.includes('origin') ? 'border-red-500' : ''}`}
              placeholder="شهر مبدا"
            />
          </div>
          
          <div>
            <Label className="text-gray-300">مقصد</Label>
            <Input
              value={bookingData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${missingFields.includes('destination') ? 'border-red-500' : ''}`}
              placeholder="شهر مقصد"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-gray-300">تاریخ رفت</Label>
            <Input
              type="date"
              value={bookingData.departureDate}
              onChange={(e) => handleInputChange('departureDate', e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${missingFields.includes('departureDate') ? 'border-red-500' : ''}`}
            />
          </div>
          
          <div>
            <Label className="text-gray-300">تاریخ برگشت (اختیاری)</Label>
            <Input
              type="date"
              value={bookingData.returnDate}
              onChange={(e) => handleInputChange('returnDate', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">تعداد مسافر</Label>
            <Select value={bookingData.passengers.toString()} onValueChange={(value) => handleInputChange('passengers', parseInt(value))}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} نفر</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-gray-300">کلاس پرواز</Label>
            <Select value={bookingData.class} onValueChange={(value) => handleInputChange('class', value)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">اکونومی</SelectItem>
                <SelectItem value="business">بیزینس</SelectItem>
                <SelectItem value="first">درجه یک</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">اطلاعات شخصی</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-gray-300">نام</Label>
            <Input
              value={bookingData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${missingFields.includes('firstName') ? 'border-red-500' : ''}`}
              placeholder="نام"
            />
          </div>
          
          <div>
            <Label className="text-gray-300">نام خانوادگی</Label>
            <Input
              value={bookingData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${missingFields.includes('lastName') ? 'border-red-500' : ''}`}
              placeholder="نام خانوادگی"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">ایمیل</Label>
            <Input
              type="email"
              value={bookingData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${missingFields.includes('email') ? 'border-red-500' : ''}`}
              placeholder="example@email.com"
            />
          </div>
          
          <div>
            <Label className="text-gray-300">تلفن</Label>
            <Input
              value={bookingData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${missingFields.includes('phone') ? 'border-red-500' : ''}`}
              placeholder="09123456789"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105"
      >
        جستجوی پرواز
      </Button>

      {/* Missing Fields Alert */}
      {missingFields.length > 0 && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-300 text-sm">
            لطفاً فیلدهای مشخص شده با قرمز را تکمیل کنید
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
