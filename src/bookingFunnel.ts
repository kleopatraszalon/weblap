import{API_BASE}from"./apiClient";
const key="kleo_booking_session";
export function bookingSession(){let v=sessionStorage.getItem(key);if(!v){v=(globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`);sessionStorage.setItem(key,v)}return v}
export function trackBooking(event_name:string,payload:Record<string,unknown>={}){try{void fetch(`${API_BASE}/api/public/booking/v4/funnel-event`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_id:bookingSession(),event_name,...payload})}).catch(()=>undefined)}catch{}}
