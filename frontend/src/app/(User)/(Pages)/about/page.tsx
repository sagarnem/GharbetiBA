"use client";
import { motion } from "framer-motion";
import Head from "next/head";
import {
  FaCheckCircle,
  FaSearch,
  FaUserShield,
  FaChartLine,
  FaHome,
  FaHandshake,
} from "react-icons/fa";

const AboutUs = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>About Gharbhetiba - Nepal&apos;s Trusted Rental Platform</title>
        <meta
          name="description"
          content="Discover Gharbhetiba.com - Nepal&apos;s premier rental platform connecting tenants with verified properties across Kathmandu, Pokhara, and more."
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Welcome to Gharbhetiba.com
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl max-w-3xl mx-auto"
            >
              Nepal&apos;s trusted platform for finding, listing, and managing rental
              and real estate properties
            </motion.p>
          </div>
        </div>

        {/* Intro Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-16"
        >
          <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-4xl mx-auto">
            <p className="text-gray-600 text-lg mb-6">
              Whether you&apos;re looking for a cozy apartment in Kathmandu, a shared
              room in Pokhara, or a commercial space in Lalitpur, we make
              property search simple, transparent, and fast.
            </p>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          </div>
        </motion.section>

        {/* What We Do */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-12 bg-white"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What We Do
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Connect Renters & Buyers
              </h3>
              <p className="text-gray-600">
                With verified listings across Nepal
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Help Property Owners
              </h3>
              <p className="text-gray-600">
                List and promote properties effectively
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Tailored filters for Nepalese properties
              </p>
            </div>
          </div>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-16 bg-gray-50"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaCheckCircle className="text-orange-500 text-2xl" />,
                title: "Verified Listings",
                desc: "Real photos and accurate details",
              },
              {
                icon: <FaUserShield className="text-orange-500 text-2xl" />,
                title: "User-Friendly Platform",
                desc: "Designed specifically for Nepalese users",
              },
              {
                icon: <FaChartLine className="text-orange-500 text-2xl" />,
                title: "Dedicated Support",
                desc: "Our team is always ready to help",
              },
              {
                icon: <FaCheckCircle className="text-orange-500 text-2xl" />,
                title: "Flexible Options",
                desc: "Free and premium listing choices",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-16"
        >
          <div className="bg-orange-600 text-white rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg max-w-3xl mx-auto">
              At Gharbhetiba.com, our mission is to simplify the rental and
              buying process for everyone in Nepal. We aim to bring innovation,
              trust, and efficiency to the local real estate market.
            </p>
          </div>
        </motion.section>

        {/* For Property Owners */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-16 bg-white"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                For Property Owners
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                List your property in minutes and connect with thousands of
                active renters and buyers. Our dashboard makes managing listings
                and inquiries easy and efficient.
              </p>
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
                List Your Property
              </button>
            </div>
            <div className="bg-gray-100 rounded-xl p-8 text-center">
              <div className="text-5xl text-orange-600 mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">
                Easy Property Management
              </h3>
              <p className="text-gray-600">
                Dashboard tools for all your listings
              </p>
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Let&apos;re looking for a cozy apartment in Kathmandu, a shareds Make Property Search Stress-Free
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who found their perfect property
            through Gharbhetiba.com
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Browse Properties
            </button>
            <button className="border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium py-3 px-8 rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
          <div className="mt-12 text-gray-500 font-medium">
            Gharbhetiba.com — Nepal&apos&apos;re looking for a cozy apartment in Kathmandu, a shareds Rental Solution
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default AboutUs;
