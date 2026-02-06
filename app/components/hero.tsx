type Args = {
  title: string;
  description: string;
};

export default function Hero({ title, description }: Args) {
  return (
    <div className="flex bg-gray-800 h-svh md:h-100">
      <div className="space-y-2 w-100 m-auto items-center">
        <p className="text-center text-4xl font-extrabold">{title}</p>
        <p className="text-center">{description}</p>
      </div>
    </div>
  );
}
