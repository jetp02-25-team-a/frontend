'use client';

type Props = { name: string; avatar?: string };

export default function TripProfile({ name, avatar = '/avatar.png' }: Props) {
  return (
    <div className="text-center">
      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg mb-4">
        <img
          src={avatar || '/avatar.png'}
          alt="User"
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-500 mt-1">私人行程</p>
    </div>
  );
}
