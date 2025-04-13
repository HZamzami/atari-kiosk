import { Toilet, Droplet } from "lucide-react";

const ToiletDroplet = () => (
  <div className="relative w-8 h-8">
    <Toilet className="text-gray-700 w-8 h-8" />
    <Droplet className="absolute -top-1 -right-1 w-3 h-3 text-blue-600 bg-white rounded-full" />
  </div>
);

export default ToiletDroplet;
