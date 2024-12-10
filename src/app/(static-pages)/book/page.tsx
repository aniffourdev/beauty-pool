// app/(static-pages)/book/page.js
import BookResult from '@/components/dynamic/Book/BookResult';
import React, { Suspense } from 'react';

const BookPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookResult />
    </Suspense>
  );
};

export default BookPage;
