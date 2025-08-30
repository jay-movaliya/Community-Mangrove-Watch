# MangroveWatch - Community Conservation Platform

A Flutter-based mobile application that empowers communities to protect and monitor mangrove ecosystems through collaborative reporting and conservation efforts.

## 🌿 About MangroveWatch

MangroveWatch is a community-driven conservation platform designed to protect mangrove ecosystems by enabling citizens, NGOs, government officials, and environmental researchers to report incidents, monitor conservation efforts, and collaborate on protecting these vital coastal ecosystems.

## ✨ Key Features

### 🔐 User Authentication & Management
- **Multi-role Registration**: Support for Citizens, NGO Representatives, Government Officials, Local Community Leaders, Students/Academics, Journalists/Media, and Others
- **Email & Phone Verification**: Secure OTP-based verification system
- **Profile Management**: Comprehensive user profiles with role-based access

### 📱 Incident Reporting System
- **Photo Documentation**: Camera integration and gallery access for evidence collection
- **GPS Location Tracking**: Automatic location detection with manual override options
- **Incident Categories**: 
  - Illegal Dumping
  - Wood Cutting
  - Waste Disposal
  - Construction Activity
  - Other Environmental Damage
- **AI-Powered Validation**: Machine learning models automatically validate incident reports using:
  - Computer vision for dumping and cutting detection
  - Geospatial analysis to verify mangrove proximity
  - Confidence scoring to ensure report accuracy
- **Gamification**: Point-based reward system for active community participation

### 🗺️ Location Services
- **GPS Integration**: Automatic location detection using device GPS
- **Custom Location Input**: Manual location entry with coordinate validation
- **Geolocation Accuracy**: High-precision location tracking for incident reports

### 📊 Dashboard & Analytics
- **Personal Impact Tracking**: Monitor your conservation contributions
- **Statistics Display**: Reports submitted, points earned, trees monitored, community ranking
- **Quick Actions**: Easy access to reporting and monitoring features

### 🔗 Backend Integration
- **RESTful API**: Comprehensive backend integration for all app features
- **Real-time Sync**: Automatic data synchronization with cloud servers
- **Secure Communication**: HTTPS-based secure data transmission

## 🛠️ Technical Stack

### Frontend (Mobile App)
- **Framework**: Flutter 3.7.0+
- **Language**: Dart
- **UI/UX**: Material Design 3 with custom green theme
- **Typography**: Google Fonts (Poppins)

### AI Backend (Validation Service)
- **Framework**: Flask (Python)
- **ML Library**: PyTorch
- **Computer Vision**: Pre-trained ResNet18 models
- **Geospatial**: GeoPandas + Shapely for mangrove area validation
- **Dependencies**:
  ```python
  flask
  flask-cors
  torch
  torchvision
  pillow
  geopandas
  shapely
  ```

### Key Dependencies
```yaml
dependencies:
  flutter: sdk
  google_fonts: ^6.1.0      # Typography
  camera: ^0.10.5+5         # Camera functionality
  geolocator: ^10.1.0       # GPS location services
  permission_handler: ^11.1.0 # Device permissions
  image_picker: ^1.0.4      # Image selection
  http: ^1.1.0              # API communication
  shared_preferences: ^2.2.2 # Local storage
```

### Backend Services
- **API Base URL**: `https://manishkumardev.me/mangrove`
- **Endpoints**:
  - User Registration & Authentication
  - OTP Verification & Resend
  - User Profile Management
  - Incident Report Submission
  - User Reports Retrieval

### AI Validation System
- **Framework**: Flask + PyTorch
- **Models**: Pre-trained ResNet18 for incident classification
- **Capabilities**:
  - **Dumping Detection**: AI model to identify illegal dumping in photos
  - **Cutting Detection**: AI model to detect illegal wood cutting activities
  - **Geospatial Validation**: Mangrove area verification using GeoJSON data
  - **Confidence Scoring**: Threshold-based validation (75% confidence minimum)
- **Deployment**: Cloud-hosted prediction service with CORS support

## 📱 System Architecture

### AI Validation Pipeline
```
User Report → Photo + GPS → AI Backend → Validation Result
    ↓              ↓            ↓              ↓
Mobile App → Image Capture → Flask API → ML Models → Response
                                ↓
                        1. Mangrove Area Check
                        2. Dumping Detection Model  
                        3. Cutting Detection Model
                        4. Confidence Scoring
                        5. Final Validation Result
```

### Screen Structure
```
lib/
├── main.dart                    # App entry point
├── screens/
│   ├── splash_screen.dart       # App launch screen
│   ├── register_screen.dart     # User registration
│   ├── login_screen.dart        # User authentication
│   ├── otp_verification_screen.dart # Email/SMS verification
│   ├── home_screen.dart         # Main dashboard with tabs
│   ├── dashboard_screen.dart    # User statistics & quick actions
│   ├── report_incident_screen.dart # Incident reporting interface
│   ├── my_reports_screen.dart   # User's submitted reports
│   └── profile_screen.dart      # User profile management
└── services/
    ├── api_service.dart         # Backend API integration
    └── auth_service.dart        # Authentication management
```

### User Roles & Permissions
- **Citizen**: Basic reporting and monitoring capabilities
- **NGO Representative**: Enhanced reporting with organizational context
- **Government Official**: Administrative oversight and validation
- **Local Community Leader**: Community coordination features
- **Student/Academic**: Research-focused data collection
- **Journalist/Media**: Documentation and awareness features
- **Other**: Flexible role for specialized users

## 🚀 Getting Started

### Prerequisites
- Flutter SDK 3.7.0 or higher
- Dart SDK
- Android Studio / VS Code with Flutter extensions
- Android device/emulator or iOS device/simulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Community-Mangrove-Watch.git
   cd Community-Mangrove-Watch
   ```

2. **Navigate to the app directory**
   ```bash
   cd app
   ```

3. **Install dependencies**
   ```bash
   flutter pub get
   ```

4. **Run the application**
   ```bash
   flutter run
   ```

### AI Backend Setup (Optional - for development)

If you want to run the AI validation service locally:

1. **Install Python dependencies**
   ```bash
   pip install flask flask-cors torch torchvision pillow geopandas shapely
   ```

2. **Download required model files**
   - `dumping_model.pth` - Dumping detection model
   - `cutting_model.pth` - Wood cutting detection model  
   - `clipped_gmw.json` - Mangrove areas GeoJSON data

3. **Run the Flask server**
   ```bash
   python app.py
   ```

4. **Update API endpoint** in Flutter app to point to local server:
   ```dart
   // For local development
   static const String aiApiUrl = 'http://localhost:5000';
   ```

### Configuration

#### Permissions Setup
The app requires the following permissions:
- **Camera**: For capturing incident photos
- **Location**: For GPS-based incident reporting
- **Storage**: For accessing device gallery
- **Internet**: For API communication

#### API Configuration
Update the API base URL in `lib/services/api_service.dart` if needed:
```dart
static const String baseUrl = 'https://manishkumardev.me/mangrove';
```

## 📋 Usage Guide

### 1. Registration Process
1. Launch the app and tap "Create Account"
2. Fill in personal details (name, email, phone)
3. Select your user type from the dropdown
4. Create a secure password
5. Agree to terms and conditions
6. Verify your email with the OTP sent

### 2. Reporting an Incident
1. Navigate to the "Report" tab
2. Choose between GPS or custom location
3. Select incident type from predefined categories
4. Add a detailed description
5. Capture or select a photo as evidence
6. Submit the report for AI validation
7. Receive instant feedback on report validity and earn points for verified incidents

### 3. Dashboard Features
- View your impact statistics
- Track points and community ranking
- Access quick action buttons
- Monitor your submitted reports

## 🎨 Design System

### Color Palette
- **Primary Green**: `#4CAF50` - Main brand color
- **Dark Green**: `#2E7D32` - Secondary brand color
- **Background**: White with green gradients
- **Text**: Dark gray with green accents

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: Regular (400), Medium (500), Semi-Bold (600), Bold (700)

### UI Components
- **Rounded Corners**: 12px border radius for cards and buttons
- **Shadows**: Subtle elevation with opacity-based shadows
- **Icons**: Material Design icons with green color scheme

## 🔧 Development

### Project Structure
```
app/
├── android/          # Android-specific configuration
├── ios/             # iOS-specific configuration
├── lib/             # Main application code
├── test/            # Unit and widget tests
├── pubspec.yaml     # Dependencies and configuration
└── README.md        # Project documentation
```

### Code Quality
- **Linting**: Flutter lints enabled for code quality
- **Error Handling**: Comprehensive try-catch blocks
- **User Feedback**: Snackbars and dialogs for user communication
- **Loading States**: Progress indicators for async operations

### API Integration
All API calls are centralized in `ApiService` class with:
- JSON request/response handling
- Error handling and user feedback
- Debug logging for development
- Timeout management

### AI Model Details
The validation system uses two specialized PyTorch models:

#### Dumping Detection Model (`dumping_model.pth`)
- **Architecture**: ResNet18 with custom classification head
- **Purpose**: Identifies illegal dumping activities in photos
- **Classes**: Binary classification (Yes/No)
- **Confidence Threshold**: 75%

#### Cutting Detection Model (`cutting_model.pth`)
- **Architecture**: ResNet18 with custom classification head  
- **Purpose**: Detects illegal wood cutting activities
- **Classes**: Binary classification (Yes/No)
- **Confidence Threshold**: 75%

#### Geospatial Validation
- **Data Source**: Global Mangrove Watch (GMW) GeoJSON
- **Buffer Zone**: 10km radius around reported coordinates
- **Validation**: Ensures incidents are reported within mangrove areas

## 🌍 Environmental Impact

MangroveWatch contributes to environmental conservation by:
- **Community Engagement**: Empowering local communities to protect mangroves
- **Real-time Monitoring**: Enabling rapid response to environmental threats
- **Data Collection**: Gathering valuable data for conservation research
- **Awareness Building**: Educating users about mangrove ecosystem importance
- **Collaborative Action**: Connecting various stakeholders for unified conservation efforts

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow Flutter/Dart coding conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

For support, questions, or collaboration opportunities:
- **Email**: [contact@mangrovewatch.org](mailto:contact@mangrovewatch.org)
- **Issues**: [GitHub Issues](https://github.com/your-username/Community-Mangrove-Watch/issues)
- **Documentation**: [Project Wiki](https://github.com/your-username/Community-Mangrove-Watch/wiki)

## 🙏 Acknowledgments

- **Flutter Team**: For the amazing cross-platform framework
- **Conservation Organizations**: For guidance on environmental protection
- **Community Contributors**: For their valuable feedback and contributions
- **Mangrove Researchers**: For scientific insights and validation

---

**Together, we can protect mangrove ecosystems for future generations! 🌿**