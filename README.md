# Los Angeles County Crime Data Viewer 

The Los Angeles County Crime Data Viewer is a web application that provides an interactive way to explore crime data for Los Angeles County. It allows users to filter, visualize, and navigate through large datasets of crime records. This application is built with a Flask backend and a frontend powered by HTML, CSS, JavaScript, Leaflet, and Plotly.js.

# Data source
LAPD OpenData: https://catalog.data.gov/dataset/crime-data-from-2020-to-present 

# Use cases

- Provide insight into crime trends: Identify neighborhoods prone to crime and analyze patterns regarding targeted age groups, crime types, resolution rates, and pending cases.
- Facilitate informed decision-making: Enable citizens to plan their activities and movements by providing easy access to up-to-date crime statistics.
- Enhance safety for residents and tourists: Offer essential information to residents for navigating their surroundings and assist tourists in unfamiliar areas.
- Aid law enforcement and city planning: Offer valuable data for the police department and city government to strategize crime prevention measures and urban planning initiatives.


# Features

- Data Fetching: Fetches and displays crime data in chunks of 1000 records.
- Filtering: Allows users to filter crime data by date range, city, and crime type.
- Pagination: Supports navigation through multiple pages of data.
- Map Visualization: Displays crime data on an interactive map with markers indicating crime locations.
- Chart Visualization: Uses Chart.js to create visual representations of crime data.
- Legend: Provides a legend to distinguish between different types of crimes.

# Technologies Used

- Flask: Python web framework used for the backend API.
- HTML/CSS/JavaScript: Core web technologies used for building the frontend.
- Leaflet: JavaScript library for interactive maps.
- Plotly.js: JavaScript library for creating charts and visualizations.
- d3: event listeners and get data from url
- PostgreSQL and PGAdmin4: store database  
- Pandas library: clean data

# Getting Started

 Prerequisites

- Python
- Flask
- SQL Alchemy
- PostgreSQL and PGAdmin4

 Installation

1. Clone the repository:
    git clone https://github.com/your-username/crime-data-viewer.git
    cd crime-data-viewer
    

2. Install the required Python packages:
    pip install flask requests
    pip install psycopg2-binary
    pip install flask-cors

3. Script is listed for default local host 5432

# Running the Application

1. Start the Flask server:
    terminal command in directory with file: python app.py

2. Open your web browser and go to `http://127.0.0.1:5000` to view the application and modify using below endpoints as desired.

# App Structure

- `/`: The frontend HTML file that contains the user interface. Renders 'index.html' file.
- `/bar`: Bar charts of where and what types of crimes are happening in LA 
- `/time`: Time series charts showing what time of year and time of day crimes frequently occur in LA
- `/pie`: pie charts of victim demographics for crimes in LA
 `/data_page`: fetches paginated crime data, limits 1000 per page with page buttons for navigation.


# Project Structure
- `la_crime.ipynb`: Jupyter notebook with code to extract and cleanse data with Pandas library and send data to Postgres using SQL Alchemy
- `crimes_table_schema.sql`: exported table schema for Postgres database
- `app.py`: The main Flask application file that handles API requests.
- `static folder`: Holds Javascript scripts for visualizations
- `templates folder`: Holds .html templates (with links to Javascript files) to render with flask app
- `la_crimes.csv`: exported csv file of data post cleaning



# Frontend Functionality

 ## Map ('/' endpoint)

1. Select Date Range: Use the date pickers to select a start date and an end date.
2. Get Crime Data: Click the "Get Crime Data" button to fetch the crime data for the selected date range.
3. View Data: The data will be displayed in a collapsible section, and the map will be populated with markers indicating the location of each crime.

## Bar ('/bar' endpoint)
1. Two bar charts: one by number of crimes per area and one by number of crimes by type
2. Choose start and end date for crimes reported in a particular time range 
3. Click on one area to filter chart of crimes by type to view types of crime in that area
4. Click on type of crime to filter areas chart for distribution of that type of crime by area
5. Clear filters by clicking "Reset Filters"


# Ethical Considerations
- Identify  reporting biases when using the data and mitigate/prevent algorithmic bias in  predictive modeling. 
    - We should identify any reporting biases that may be present and think through steps to prevent or at the very least, mitigate, any algorithmic bias when using it in predictive modeling. For example, victim demographic information could give us valuable information on what’s happening to certain communities but we should be careful in using that information to predict future crimes happening to that particular community without taking into account all the different variables that could play into it and perpetuate bias. It’s a delicate balance of an informative view vs. a biased one.
- Provide context to prevent misleading representation of data
- Report on facts and avoid adding opinions that would sensationalize or stigmatize communities
- Disclose possibility of inaccuracies due to transcription
    - Because this dataset was transcribed from crimes reported on paper, we must disclose that there is a possibility of inaccuracies due to transcription errors.

# Presentation Link
https://docs.google.com/presentation/d/1Nh8fnIOFrAObTgh9Wi7_SfEj1jz-9krxQI4cPsYPw80/edit?usp=sharing 