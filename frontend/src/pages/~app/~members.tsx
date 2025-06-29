import { createFileRoute } from '@tanstack/react-router';
import { Search, UserPlus, Mail, Shield, Crown, Star } from 'lucide-react';

import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import { Card } from '@/shared/shadcn/card';
import { Input } from '@/shared/shadcn/input';

export const Route = createFileRoute('/app/members')({
  component: MembersPage,
});

function MembersPage() {
  const members = [
    {
      id: 1,
      name: 'Max Mustermann',
      role: 'Vorsitzender',
      roleType: 'admin',
      joined: '2022',
      email: 'max@fanini.live',
      avatar: null,
      eventCount: 42,
    },
    {
      id: 2,
      name: 'Sarah Schmidt',
      role: 'Schatzmeisterin',
      roleType: 'admin',
      joined: '2022',
      email: 'sarah@fanini.live',
      avatar: null,
      eventCount: 38,
    },
    {
      id: 3,
      name: 'Tom Krause',
      role: 'Event-Manager',
      roleType: 'moderator',
      joined: '2022',
      email: 'tom@fanini.live',
      avatar: null,
      eventCount: 45,
    },
    {
      id: 4,
      name: 'Lisa Fischer',
      role: 'Mitglied',
      roleType: 'member',
      joined: '2023',
      email: 'lisa@fanini.live',
      avatar: null,
      eventCount: 12,
    },
    {
      id: 5,
      name: 'Jan Weber',
      role: 'Mitglied',
      roleType: 'member',
      joined: '2023',
      email: 'jan@fanini.live',
      avatar: null,
      eventCount: 8,
    },
    {
      id: 6,
      name: 'Anna Meyer',
      role: 'Social Media',
      roleType: 'moderator',
      joined: '2023',
      email: 'anna@fanini.live',
      avatar: null,
      eventCount: 28,
    },
  ];

  const roleIcons = {
    admin: Crown,
    moderator: Shield,
    member: Star,
  };

  const roleColors = {
    admin: 'bg-amber-100 text-amber-700 border-amber-200',
    moderator: 'bg-fanini-blue-100 text-fanini-blue-700 border-fanini-blue-200',
    member: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <div className='space-y-6 p-8'>
      {/* Page Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-fanini-blue-700 text-3xl font-bold'>Mitglieder</h1>
          <p className='text-muted-foreground mt-1'>156 aktive Vereinsmitglieder</p>
        </div>
        <Button className='bg-fanini-blue-600 hover:bg-fanini-blue-700'>
          <UserPlus className='mr-2 h-4 w-4' />
          Mitglied einladen
        </Button>
      </div>

      {/* Search Bar */}
      <div className='relative max-w-md'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input placeholder='Mitglieder suchen...' className='pl-9' />
      </div>

      {/* Members Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {members.map(member => {
          const RoleIcon = roleIcons[member.roleType as keyof typeof roleIcons];

          return (
            <Card key={member.id} className='p-6 transition-all duration-300 hover:shadow-lg'>
              <div className='flex items-start gap-4'>
                {/* Avatar */}
                <div className='relative'>
                  <div className='from-fanini-blue-400 to-fanini-blue-600 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-xl font-semibold text-white'>
                    {member.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </div>
                  {member.roleType !== 'member' && (
                    <div className='absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm'>
                      <RoleIcon className='text-fanini-blue-600 h-3.5 w-3.5' />
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className='min-w-0 flex-1'>
                  <h3 className='text-lg font-semibold'>{member.name}</h3>
                  <Badge
                    variant='outline'
                    className={`mt-1 ${roleColors[member.roleType as keyof typeof roleColors]}`}
                  >
                    {member.role}
                  </Badge>

                  <div className='text-muted-foreground mt-3 space-y-1 text-sm'>
                    <div className='flex items-center gap-1'>
                      <Mail className='h-3.5 w-3.5' />
                      <span className='truncate'>{member.email}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>Dabei seit {member.joined}</span>
                      <span className='text-fanini-blue-600 font-medium'>
                        {member.eventCount} Events
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className='mt-4 flex gap-2 border-t pt-4'>
                <Button size='sm' variant='outline' className='flex-1'>
                  Profil
                </Button>
                <Button size='sm' variant='outline' className='flex-1'>
                  Nachricht
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      <div className='flex justify-center pt-4'>
        <Button variant='outline' size='lg'>
          Weitere Mitglieder laden
        </Button>
      </div>
    </div>
  );
}
