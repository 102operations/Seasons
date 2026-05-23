import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = { title: 'Contact Us' };

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_STORE_EMAIL || 'contact@store.com';
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  return (
    <div className="container py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground">We&apos;re here to help — reach out anytime</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-950 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-4">Fastest way to reach us</p>
            <Button asChild variant="outline" className="w-full border-green-500 text-green-600">
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer">
                Chat Now
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-950 mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <p className="text-sm text-muted-foreground mb-4">{email}</p>
            <Button asChild variant="outline" className="w-full">
              <a href={`mailto:${email}`}>Send Email</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-950 mx-auto mb-4 flex items-center justify-center">
              <Phone className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Phone</h3>
            <p className="text-sm text-muted-foreground mb-4">+{phone}</p>
            <Button asChild variant="outline" className="w-full">
              <a href={`tel:+${phone}`}>Call Now</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6 grid sm:grid-cols-2 gap-6">
          <div className="flex gap-3">
            <Clock className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Business Hours</h4>
              <p className="text-sm text-muted-foreground">Monday — Saturday: 9 AM — 7 PM</p>
              <p className="text-sm text-muted-foreground">Sunday: Closed</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Delivery Area</h4>
              <p className="text-sm text-muted-foreground">Nationwide delivery available</p>
              <p className="text-sm text-muted-foreground">2-5 business days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
