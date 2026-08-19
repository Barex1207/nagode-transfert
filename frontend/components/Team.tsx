import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { api } from '../lib/api';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
}

const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    api
      .get<TeamMember[]>('/team-members')
      .then(setMembers)
      .catch(() => setMembers([]));
  }, []);

  if (members.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-dark)]">Notre Équipe</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Des visages, pas juste un service</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            L'équipe qui fait rouler Nagode Transfert chaque jour.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div key={member.id} className="text-center space-y-3">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <User size={40} />
                  </div>
                )}
              </div>
              <div>
                <p className="font-black text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
