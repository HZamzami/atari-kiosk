import { Toilet, Octagon } from "lucide-react";

const ToiletStop = () => (
  <div className="relative w-8 h-8">
    <Toilet className="text-gray-600 w-8 h-8" />
    <Octagon className="absolute -top-1 -right-1 w-3 h-3 text-red-600 bg-white rounded-full" />
  </div>
);

export default ToiletStop;
