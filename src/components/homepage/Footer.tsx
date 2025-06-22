import React from 'react';
import { ExternalLink, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* University Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-300">University of Rwanda</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              College of Science and Technology - Leading innovation in STEM education and research in Rwanda.
            </p>
            <div className="flex items-center space-x-2 text-sm text-blue-200">
              <MapPin className="h-4 w-4" />
              <span>Kigali, Rwanda</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-300">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  UR Strategic Plan 2018-2025
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Academic Programs
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Research & Innovation
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Campus Life
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-300">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-blue-200">
                <Mail className="h-4 w-4" />
                <span>info@cst.ur.ac.rw</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-200">
                <Phone className="h-4 w-4" />
                <span>+250 788 123 456</span>
              </div>
            </div>
          </div>

          {/* Social Media & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-300">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <div className="space-y-2 text-xs text-blue-300">
              <a href="#" className="block hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block hover:text-white transition-colors">
                Terms of Use
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-300">
          <p>&copy; 2024 University of Rwanda - College of Science and Technology. All rights reserved.</p>
          <p className="mt-2">Smart Campus Planner - Empowering Sustainable Education through AI</p>
        </div>
      </div>
    </footer>
  );
};
