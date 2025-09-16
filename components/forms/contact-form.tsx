"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendContactEmail } from "@/lib/actions/send-contact-email";

interface ContactFormProps {
  recipientEmail: string;
  recipientName: string;
}

export default function ContactForm({ recipientEmail, recipientName }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("All fields are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await sendContactEmail({
        to: recipientEmail,
        toName: recipientName,
        fromName: formData.name,
        fromEmail: formData.email,
        message: formData.message
      });

      if (result.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError(result.error || "Failed to send message");
      }
    } catch (err) {
      setError("An unexpected error occurred: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Message Sent!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Your message has been sent to {recipientName}. They&apos;ll get back to you soon!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Contact {recipientName}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Your Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            className="min-h-[120px] resize-none"
            disabled={isSubmitting}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
