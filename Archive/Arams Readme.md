Los Angeles County Crime Data Viewer

The Los Angeles County Crime Data Viewer is a web application that provides an interactive way to explore crime data for Los Angeles County. It allows users to filter, visualize, and navigate through large datasets of crime records. This application is built with a Flask backend and a frontend powered by HTML, CSS, JavaScript, Leaflet, and Chart.js.

 Features

- Data Fetching: Fetches and displays crime data in chunks of 1000 records.
- Filtering: Allows users to filter crime data by date range, city, and crime type.
- Pagination: Supports navigation through multiple pages of data.
- Map Visualization: Displays crime data on an interactive map with markers indicating crime locations.
- Chart Visualization: Uses Chart.js to create visual representations of crime data.
- Legend: Provides a legend to distinguish between different types of crimes.

 Technologies Used

- Flask: Python web framework used for the backend API.
- HTML/CSS/JavaScript: Core web technologies used for building the frontend.
- Leaflet: JavaScript library for interactive maps.
- Chart.js: JavaScript library for creating charts and visualizations.

 Getting Started

 Prerequisites

- Python 3.x
- Flask

 Installation

1. Clone the repository:
    git clone https://github.com/your-username/crime-data-viewer.git
    cd crime-data-viewer
    

2. Install the required Python packages:
    pip install flask requests

 Running the Application

1. Start the Flask server:
    python app.py
   

2. Open your web browser and go to `http://127.0.0.1:5000` to view the application.

 Project Structure

- `app.py`: The main Flask application file that handles API requests.
- `static/index.html`: The frontend HTML file that contains the user interface.


 `/paged-crime-data`

- Fetches paginated crime data.
- Parameters:
  - `page`: Page number for pagination (default: 1).
  - `limit`: Number of records to fetch per page (default: 1000).

 `/crime-data-count`

- Fetches the total count of crime records.

 Frontend Functionality

 Fetch Crime Data

1. Select Date Range: Use the date pickers to select a start date and an end date.
2. Get Crime Data: Click the "Get Crime Data" button to fetch the crime data for the selected date range.
3. View Data: The data will be displayed in a collapsible section, and the map will be populated with markers indicating the location of each crime.


