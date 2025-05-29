"use client";

import React from "react";

export default function HowGBAWorks() {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-6 py-16">
      <h1 className="text-5xl font-semibold text-orange-700 mb-12 text-center">
        How GBA Works
      </h1>

      <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 border border-orange-300">
        <p className="text-orange-800 text-lg leading-relaxed mb-8">
          GBA (Ghar Beti Automation) is a state-of-the-art platform designed to simplify and streamline your home automation experience. Leveraging cutting-edge technology, GBA provides an intuitive and secure way to manage your smart devices and automate everyday tasks effortlessly.
        </p>

        <ol className="list-decimal list-inside space-y-6 text-orange-700 text-lg leading-relaxed">
          <li>
            <strong>Account Registration & Configuration:</strong> Begin by creating your secure account and setting up preferences tailored to your needs.
          </li>
          <li>
            <strong>Device Integration:</strong> Seamlessly connect compatible smart devices to the GBA ecosystem for centralized management.
          </li>
          <li>
            <strong>Automation Setup:</strong> Define custom automation rules with an easy-to-use interface, scheduling actions based on triggers, time, or sensor data.
          </li>
          <li>
            <strong>Real-Time Monitoring & Control:</strong> Access the comprehensive dashboard or mobile app to monitor device status and control automations anytime, anywhere.
          </li>
          <li>
            <strong>Alerts & Notifications:</strong> Receive timely notifications on important events, system status, and security alerts to stay informed.
          </li>
          <li>
            <strong>Continuous Updates & Support:</strong> Benefit from ongoing feature enhancements, security updates, and expert customer support ensuring reliable performance.
          </li>
        </ol>

        <p className="text-orange-800 text-lg mt-10">
          GBA empowers you to take control of your home environment with confidence and convenience, making smart living accessible and efficient.
        </p>
      </div>
    </div>
  );
}
