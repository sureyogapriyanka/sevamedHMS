import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import LanguageSelector from "../components/common/LanguageSelector";
import ThemeToggle from "../components/common/ThemeToggle";
import { useLanguage } from "../contexts/LanguageContext";
import { Heart, ArrowLeft, Target, Users, Globe, Shield, Stethoscope, Activity, Award, CheckCircle } from "lucide-react";

export default function MissionPage() {
    const [, setLocation] = useLocation();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            {/* Header */}
            <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => setLocation("/")}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to Home</span>
                            </Button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Our Mission</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="w-48">
                                <LanguageSelector />
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Target className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold">Our Mission</h1>
                            </div>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                To provide compassionate, comprehensive healthcare services that save lives, restore health,
                                and improve the quality of life for every individual who walks through our doors.
                                We are committed to excellence in medical care, innovation in treatment, and dedication to our community.
                            </p>
                            <div className="flex space-x-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => setLocation("/register")}
                                >
                                    Join Our Mission
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                                    onClick={() => setLocation("/staff-login")}
                                >
                                    Healthcare Careers
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80"
                                alt="Healthcare Mission - Compassionate patient care"
                                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Our Mission Statement</h2>
                        <div className="max-w-6xl mx-auto">
                            <blockquote className="text-2xl text-blue-600 dark:text-blue-300 italic leading-relaxed mb-8 font-medium">
                                "To heal, to comfort, to care - these are not just our services, but our sacred promise to every person
                                who entrusts us with their health. We exist to save lives, restore hope, and ensure that quality
                                healthcare is accessible to all, regardless of their circumstances."
                            </blockquote>
                            <div className="text-right">
                                <p className="text-lg text-blue-800 dark:text-blue-400 font-semibold">- SevaMed Healthcare Team</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Mission Pillars */}
            <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-blue-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Our Mission Pillars</h2>
                        <p className="text-xl text-blue-600 dark:text-blue-300">
                            Four fundamental principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-700 dark:bg-gray-800">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Heart className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-blue-800 dark:text-blue-400">Compassionate Care</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700 dark:text-blue-300 mb-4">
                                    Every patient is treated with dignity, respect, and empathy. We understand that behind every medical condition
                                    is a human being with fears, hopes, and a family who loves them.
                                </p>
                                <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Patient-centered approach to all treatments</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Emotional support for patients and families</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Cultural sensitivity in all interactions</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-green-200 dark:border-green-700 dark:bg-gray-800">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                        <Award className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-green-800 dark:text-green-400">Clinical Excellence</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-green-700 dark:text-green-300 mb-4">
                                    We are committed to providing the highest standard of medical care through continuous learning,
                                    evidence-based practices, and investment in advanced medical technology.
                                </p>
                                <ul className="space-y-2 text-sm text-green-600 dark:text-green-400">
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Board-certified physicians and specialists</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>State-of-the-art medical equipment</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Continuous medical education and training</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-purple-200 dark:border-purple-700 dark:bg-gray-800">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <Globe className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-purple-800 dark:text-purple-400">Community Service</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-purple-700 dark:text-purple-300 mb-4">
                                    Healthcare is a fundamental human right. We serve our community by making quality healthcare
                                    accessible and affordable for all members of society.
                                </p>
                                <ul className="space-y-2 text-sm text-purple-600 dark:text-purple-400">
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Free health screenings and checkups</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Healthcare education and awareness programs</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Charitable care for underprivileged patients</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-orange-200 dark:border-orange-700 dark:bg-gray-800">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                                        <Activity className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-orange-800 dark:text-orange-400">Innovation & Progress</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-orange-700 dark:text-orange-300 mb-4">
                                    We embrace medical innovation and technological advancement to improve patient outcomes,
                                    reduce recovery times, and enhance the overall healthcare experience.
                                </p>
                                <ul className="space-y-2 text-sm text-orange-600 dark:text-orange-400">
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>AI-powered diagnostic and treatment tools</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Minimally invasive surgical techniques</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Telemedicine and remote monitoring</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Our Impact */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Living Our Mission Every Day</h2>
                        <p className="text-xl text-blue-600 dark:text-blue-300">
                            Our mission comes to life through the lives we touch and the community we serve
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50,000+</div>
                            <div className="text-blue-800 dark:text-blue-300 font-semibold">Lives Touched Annually</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">Patients served with compassion</div>
                        </div>
                        <div className="text-center bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">98%</div>
                            <div className="text-green-800 dark:text-green-300 font-semibold">Patient Satisfaction</div>
                            <div className="text-sm text-green-600 dark:text-green-400 mt-1">Excellence in care delivery</div>
                        </div>
                        <div className="text-center bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
                            <div className="text-purple-800 dark:text-purple-300 font-semibold">Emergency Care</div>
                            <div className="text-sm text-purple-600 dark:text-purple-400 mt-1">Always here when you need us</div>
                        </div>
                        <div className="text-center bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">200+</div>
                            <div className="text-orange-800 dark:text-orange-300 font-semibold">Healthcare Professionals</div>
                            <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">Dedicated to your health</div>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <blockquote className="text-lg text-blue-700 dark:text-blue-300 italic text-center leading-relaxed">
                            "Our mission isn't just words on a wall - it's the reason we come to work every day.
                            Every life saved, every family reunited, every patient who walks out healthy is a testament
                            to our unwavering commitment to healing and hope."
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Be Part of Our Mission</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Whether as a patient, healthcare professional, or community partner, you can be part of our mission
                        to transform healthcare and save lives in our community.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => setLocation("/register")}
                        >
                            Become a Patient
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                            onClick={() => setLocation("/staff-login")}
                        >
                            Join Our Team
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="container mx-auto px-6">
                    {/* Main Footer Content */}
                    <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{t("sevamed_hms")}</h3>
                                    <p className="text-sm text-gray-300">Healthcare Excellence</p>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Leading healthcare management system providing comprehensive medical services with cutting-edge technology and compassionate care.
                            </p>
                        </div>

                        {/* About Us */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-blue-400">About Us</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/mission" className="text-gray-300 hover:text-white transition-colors">Our Mission</a></li>
                                <li><a href="/vision" className="text-gray-300 hover:text-white transition-colors">Our Vision</a></li>
                                <li><a href="/facilities" className="text-gray-300 hover:text-white transition-colors">Our Facilities</a></li>
                                <li><a href="/about-us" className="text-gray-300 hover:text-white transition-colors">Leadership Team</a></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-green-400">Our Services</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/services/emergency-care" className="text-gray-300 hover:text-white transition-colors">Emergency Care</a></li>
                                <li><a href="/services/specialized-treatment" className="text-gray-300 hover:text-white transition-colors">Specialized Treatments</a></li>
                                <li><a href="/services/patient-management" className="text-gray-300 hover:text-white transition-colors">Patient Management</a></li>
                                <li><a href="/services/health-monitoring" className="text-gray-300 hover:text-white transition-colors">Health Monitoring</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-blue-400">Contact Us</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start space-x-3">
                                    <p className="text-gray-300">123 Healthcare Street<br />Medical District, MD 12345</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className="text-gray-300">Emergency: +1 (555) 911-HELP</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className="text-gray-300">info@sevamed.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t border-gray-700 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="text-sm text-gray-400">
                                © 2024 SevaMed Healthcare Management System. All rights reserved.
                            </div>
                            <div className="flex space-x-6 text-sm text-gray-400">
                                <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
                                <a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}