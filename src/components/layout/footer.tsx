import Link from 'next/link';
import { Facebook, Instagram, Mail, MessageCircle, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'LUXE';
  const email = process.env.NEXT_PUBLIC_STORE_EMAIL || 'contact@store.com';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 border-t mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">{storeName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium products delivered with Cash on Delivery. Quality you can trust, paid when you receive.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground">All Products</Link></li>
              <li><Link href="/products?featured=true" className="hover:text-foreground">Featured</Link></li>
              <li><Link href="/offers" className="hover:text-foreground">Offers</Link></li>
              <li><Link href="/wishlist" className="hover:text-foreground">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/track" className="hover:text-foreground">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-foreground">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-foreground">{email}</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <a href={`tel:+${whatsapp}`} className="hover:text-foreground">+{whatsapp}</a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {year} {storeName}. All rights reserved.</p>
          <p>💳 Cash on Delivery · 🚚 Nationwide Shipping</p>
        </div>
      </div>
    </footer>
  );
}
