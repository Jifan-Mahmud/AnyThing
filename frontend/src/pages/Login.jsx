
import { useNavigate } from 'react-router-dom';
import { Video, MessageCircle, Globe, Camera, Star } from 'lucide-react';

const EMOJIS = ['😋', '😎', '🤣', '❤️', '👍', '😒', '😄', '😍', '😂', '😁', '😉', '🙌', '🤦‍♀️', '😎', '😋', '🤩', '😴', '😫', '😪', '🤤'];

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary-pink font-sans text-black relative overflow-hidden flex flex-col">
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {EMOJIS.map((emoji, idx) => {
          // Randomize start position, animation duration, and delay for natural feel
          const leftPos = `${Math.random() * 100}%`;
          const animDuration = `${10 + Math.random() * 15}s`;
          const animDelay = `${Math.random() * 5}s`;
          const fontSize = `${1.5 + Math.random() * 2}rem`;

          return (
            <div 
              key={idx} 
              className="absolute animate-fly-up opacity-0"
              style={{
                left: leftPos,
                animationDuration: animDuration,
                animationDelay: animDelay,
                fontSize: fontSize
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 lg:px-12 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="text-2xl font-black tracking-tighter italic text-white drop-shadow-md">
            Any<span className="text-black">Thing</span>
          </div>
        </div>
        
        <div className="bg-white/30 backdrop-blur-md rounded-full px-2 py-2 flex items-center gap-2 shadow-sm">
          <button onClick={handleLogin} className="px-6 py-2 font-medium hover:text-white transition-colors">
            LogIn
          </button>
          <button onClick={handleLogin} className="px-6 py-2 bg-bg-darker text-white rounded-full font-medium hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg">
            SignIn
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center pt-8 lg:pt-16 px-4">
        
        {/* Headings */}
        <div className="text-center max-w-3xl mx-auto z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-white drop-shadow-lg">
            Engage, Evolve, Excel<br />
            <span className="text-black">Social Evolution</span>
          </h1>
          <p className="text-lg md:text-xl text-black/80 mb-8 font-medium">
            Social Media Marketing & Management
          </p>
          <button onClick={handleLogin} className="px-8 py-4 bg-bg-darker text-white rounded-full font-bold text-lg hover:bg-black transition-all hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-2xl">
            Get Started
          </button>
        </div>

        {/* Center Image & Floating Elements */}
        <div className="relative mt-12 w-full max-w-lg mx-auto z-20 flex justify-center animate-in zoom-in-95 duration-1000 delay-300">
          {/* Main Character Image Placeholder */}
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" 
            alt="Excited user" 
            className="w-64 h-80 object-cover object-top rounded-full z-10 border-8 border-primary-pink shadow-2xl hover:scale-105 transition-transform duration-500"
          />

          {/* Floating Icons */}
          <div className="absolute top-10 left-10 bg-white p-3 rounded-full shadow-lg animate-bounce hover:scale-125 transition-transform" style={{ animationDelay: '0ms', animationDuration: '3s' }}>
            <Video className="text-red-500" size={24} />
          </div>
          <div className="absolute top-24 -right-4 bg-white p-3 rounded-full shadow-lg animate-bounce hover:scale-125 transition-transform" style={{ animationDelay: '500ms', animationDuration: '2.5s' }}>
            <MessageCircle className="text-blue-400" size={24} />
          </div>
          <div className="absolute bottom-32 -left-8 bg-white p-3 rounded-full shadow-lg animate-bounce hover:scale-125 transition-transform" style={{ animationDelay: '1000ms', animationDuration: '3.5s' }}>
            <Globe className="text-blue-600" size={24} />
          </div>
          <div className="absolute bottom-10 right-4 bg-white p-3 rounded-full shadow-lg animate-bounce hover:scale-125 transition-transform" style={{ animationDelay: '1500ms', animationDuration: '2.8s' }}>
            <Camera className="text-primary-pink" size={24} />
          </div>

          {/* Circular text badge */}
          <div className="absolute top-1/2 -left-16 bg-bg-darker text-white w-24 h-24 rounded-full flex items-center justify-center p-2 transform -rotate-12 shadow-2xl hover:rotate-180 hover:scale-110 transition-all duration-700">
            <span className="text-[10px] text-center font-bold uppercase leading-tight">
              Boost your AnyThing now
            </span>
            <Star className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-pink/30" size={32} />
          </div>
        </div>

      </main>

      {/* Decorative Black Shapes */}
      
      {/* Bottom Left Black Panel */}
      <div className="absolute bottom-0 left-0 w-full md:w-1/3 bg-bg-darker text-white pt-16 pb-12 px-8 lg:px-16 rounded-tr-[80px] lg:rounded-tr-[120px] z-20 animate-in slide-in-from-left duration-1000 delay-500">
        {/* Wave Graphic Placeholder */}
        <div className="absolute -top-12 left-8 flex items-end gap-1 text-bg-darker">
           <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
             <path d="M0 20 Q 15 0, 30 20 T 60 20 T 90 20 T 120 20" stroke="currentColor" strokeWidth="3" fill="none" />
           </svg>
        </div>

        <h2 className="text-3xl lg:text-5xl font-bold leading-tight hover:text-primary-pink transition-colors cursor-default">
          From Likes<br />to Leads,<br />We Drive<br />Results
        </h2>
      </div>

      {/* Check Reviews Pill */}
      <div className="absolute top-1/2 left-8 bg-bg-darker text-white rounded-full p-2 flex items-center gap-3 pr-6 shadow-2xl z-30 transform -translate-y-1/2 hidden lg:flex hover:scale-105 transition-transform cursor-pointer animate-in fade-in duration-1000 delay-700">
        <div className="flex -space-x-3">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=U1" className="w-10 h-10 rounded-full border-2 border-bg-darker hover:-translate-y-1 transition-transform" />
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=U2" className="w-10 h-10 rounded-full border-2 border-bg-darker hover:-translate-y-1 transition-transform" />
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=U3" className="w-10 h-10 rounded-full border-2 border-bg-darker hover:-translate-y-1 transition-transform" />
        </div>
        <div className="text-xs font-bold leading-tight">
          Check<br />reviews
        </div>
      </div>

      {/* Bottom Right Black Panel */}
      <div className="absolute bottom-0 right-0 w-full md:w-[40%] bg-bg-darker text-white pt-24 pb-12 px-8 lg:px-16 rounded-tl-[100px] lg:rounded-tl-[150px] z-10 flex flex-col items-center text-center animate-in slide-in-from-right duration-1000 delay-500">
        <p className="text-sm lg:text-base font-medium text-gray-400 mb-8 max-w-xs">
          Thriving Brands, Thrilled Clients - Our AnyThing Management in Action
        </p>
        
        <div className="space-y-8 w-full max-w-[200px]">
          <div className="group cursor-default">
            <h3 className="text-4xl lg:text-5xl font-bold mb-1 group-hover:text-primary-pink transition-colors group-hover:scale-110 transform duration-300">500+</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Accounts Managed</p>
          </div>
          <div className="group cursor-default">
            <h3 className="text-4xl lg:text-5xl font-bold mb-1 group-hover:text-primary-pink transition-colors group-hover:scale-110 transform duration-300">800+</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Happy Customers</p>
          </div>
        </div>

        {/* Abstract orbits top right */}
        <div className="absolute -top-32 right-12 text-bg-darker opacity-40 animate-spin" style={{ animationDuration: '20s' }}>
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
             <ellipse cx="75" cy="75" rx="70" ry="25" stroke="currentColor" strokeWidth="4" />
             <ellipse cx="75" cy="75" rx="25" ry="70" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Login;
