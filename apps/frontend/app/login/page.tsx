'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/app-store';
import { api } from '@/lib/api/client';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { AuthUser, TokenPair } from '@/types';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAppStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tokens = await api.post<TokenPair>('/auth/login', { username, password });
      localStorage.setItem('ov_access_token', tokens.access_token);
      localStorage.setItem('ov_refresh_token', tokens.refresh_token);

      const user = await api.get<AuthUser>('/auth/me');
      setUser(user);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--ov-bg-page)' }}>
      <Card style={{ width: '400px' }}>
        <CardHeader>
          <CardTitle>OneView Monitor Login</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-secondary)', marginBottom: 'var(--ov-space-1)' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: 'var(--ov-space-2) var(--ov-space-3)', background: 'var(--ov-bg-input)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-md)', color: 'var(--ov-text-primary)' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-secondary)', marginBottom: 'var(--ov-space-1)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: 'var(--ov-space-2) var(--ov-space-3)', background: 'var(--ov-bg-input)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-md)', color: 'var(--ov-text-primary)' }}
                required
              />
            </div>
            {error && <div style={{ color: 'var(--ov-status-critical)', fontSize: 'var(--ov-font-size-sm)' }}>{error}</div>}
            <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
            <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', textAlign: 'center', marginTop: 'var(--ov-space-2)' }}>
              Demo credentials: admin / admin123
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
