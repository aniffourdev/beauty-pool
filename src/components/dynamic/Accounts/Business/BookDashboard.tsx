import React from "react";

interface BookDashboardProps {
  searchTerm: string;
}

const BookDashboard: React.FC<BookDashboardProps> = ({ searchTerm }) => {
  return <div>BookDashboard: {searchTerm}</div>;
};

export default BookDashboard;
