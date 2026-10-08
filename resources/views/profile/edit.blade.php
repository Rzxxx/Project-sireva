<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>SIREVA - Profil</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">

    <style>
        :root {
            --header-bg: #ffffff;
            --sidebar-bg: rgb(205, 205, 205);
            --card-bg: #dcdcdc;
            --text: #111;
            --header-h: 52px;
            --sidebar-collapsed: 64px;
            --sidebar-expanded: 240px;
            --sidebar-w: var(--sidebar-collapsed);
        }

        body.sidebar-open { --sidebar-w: var(--sidebar-expanded); }

        *, *::before, *::after { box-sizing: border-box; }

        html, body { margin: 0; min-height: 100%; }
        html { scroll-behavior: smooth; }

        body {
            font-family: 'Playfair Display', Georgia, serif;
            color: var(--text);
            background: #fff;
        }

        /* ---------- Header ---------- */
        .header {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 20;
            display: flex;
            align-items: center;
            height: var(--header-h);
            padding: 0 12px;
            background: var(--header-bg);
            box-shadow: 0 1px 0 rgba(0, 0, 0, .1);
        }

        .brand { display: inline-flex; align-items: center; text-decoration: none; }
        .brand img { height: 36px; width: auto; display: block; }

        /* ---------- Sidebar ---------- */
        .sidebar {
            position: fixed;
            top: var(--header-h);
            bottom: 0;
            left: 0;
            z-index: 10;
            width: var(--sidebar-w);
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 14px 10px;
            overflow: hidden;
            background: var(--sidebar-bg);
            transition: width .2s ease;
        }

        .sidebar-open .sidebar { box-shadow: 4px 0 16px rgba(0, 0, 0, .15); }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 18px;
            width: 100%;
            height: 48px;
            padding: 0 5px;
            border: 0;
            border-radius: 10px;
            background: transparent;
            color: #000;
            font-family: inherit;
            font-size: 17px;
            text-decoration: none;
            white-space: nowrap;
            cursor: pointer;
            transition: background .15s;
        }

        .nav-item:hover { background: rgba(255, 255, 255, .45); }
        .nav-item.active { background: rgba(255, 255, 255, .55); }
        .nav-item svg { width: 34px; height: 34px; flex-shrink: 0; }

        .nav-label { opacity: 0; transition: opacity .15s; }
        .sidebar-open .nav-label { opacity: 1; }

        /* ---------- Konten ---------- */
        .main {
            position: relative;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            padding: calc(var(--header-h) + 24px) 24px 40px calc(var(--sidebar-w) + 40px);
            transition: padding-left .2s ease;
            background-image:
                linear-gradient(rgba(255, 255, 255, .55), rgba(255, 255, 255, .55)),
                url('{{ asset('images/classroom.jpg') }}');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }

        /* ---------- Responsif ---------- */
        @media (max-width: 700px) {
            :root { --header-h: 48px; --sidebar-collapsed: 56px; }
            .main { padding: calc(var(--header-h) + 24px) 20px 32px calc(var(--sidebar-collapsed) + 20px); }
        }

        .logout-form { margin: auto 0 0; }
        .logout-form .nav-item:hover { background: rgba(198, 40, 40, .15); color: #8a1c1c; }

        @media (hover: hover) {
            .sidebar:hover { width: var(--sidebar-expanded); box-shadow: 4px 0 16px rgba(0, 0, 0, .15); }
            .sidebar:hover .nav-label { opacity: 1; }
        }
    </style>
    <style>
        .page-title { margin: 0; font-size: 42px; font-weight: 400; line-height: 1.2; }
        .page-sub { margin: 10px 0 28px; font-size: 19px; }

        .alert-success { margin: 0 0 20px; padding: 12px 16px; border-radius: 8px; background: #e3f4d7; color: #274012; font-size: 16px; }

        .table-card { max-width: 1100px; overflow-x: auto; border-radius: 12px; background: rgba(255, 255, 255, .92); }
        table { width: 100%; border-collapse: collapse; font-size: 16px; }
        th, td { padding: 14px 18px; text-align: left; white-space: nowrap; }
        th { font-weight: 600; border-bottom: 1px solid #ddd; }
        tbody tr:not(:last-child) td { border-bottom: 1px solid #eee; }
        td.wrap { white-space: normal; min-width: 180px; max-width: 280px; }

        .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 14px; }
        .badge-pending { background: #fff1c9; color: #7a5a00; }
        .badge-approved { background: #dff3d2; color: #274012; }
        .badge-rejected { background: #fbd9d9; color: #8a1c1c; }
        .badge-cancelled { background: #e6e6e6; color: #555; }

        .btn-cancel { padding: 8px 14px; border: 0; border-radius: 8px; background: #f3d6d6; color: #8a1c1c; font-family: inherit; font-size: 15px; cursor: pointer; }
        .btn-cancel:hover { background: #ecc3c3; }

        .empty { padding: 48px 24px; text-align: center; font-size: 18px; }
        .empty p { margin: 0 0 16px; }
        .btn-go { display: inline-block; padding: 12px 24px; border-radius: 8px; background: #3d5a1e; color: #fff; text-decoration: none; font-size: 16px; }
        .btn-go:hover { background: #324a18; }

        .section-title { margin: 0 0 14px; font-size: 24px; font-weight: 400; }
        .rooms { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; max-width: 1100px; margin-bottom: 40px; }
        .note { margin: 0 0 40px; font-size: 17px; }
        .room-card { display: flex; flex-direction: column; overflow: hidden; border-radius: 10px; background: #dcdcdc; color: var(--text); text-decoration: none; transition: transform .15s, box-shadow .15s; }
        .room-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, .15); }
        .room-thumb { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: #c9c9c9; }
        .room-thumb--empty { display: grid; place-items: center; color: #777; font-size: 14px; }
        .room-body { display: flex; flex-direction: column; gap: 4px; padding: 12px 16px 14px; }
        .room-meta { font-size: 14px; color: #555; }

        @media (max-width: 700px) {
            .page-title { font-size: 30px; }
            .page-sub { font-size: 16px; }
        }

        .profile-grid { display: grid; grid-template-columns: 300px 1fr; gap: 24px; max-width: 1000px; align-items: start; }
        .col { display: grid; gap: 24px; }
        .card { padding: 24px; border-radius: 12px; background: rgba(255, 255, 255, .92); }
        .card h3 { margin: 0 0 18px; font-size: 22px; font-weight: 500; }

        .summary { text-align: center; }
        .avatar { display: grid; place-items: center; width: 88px; height: 88px; margin: 0 auto 14px; border-radius: 50%; background: #3d5a1e; color: #fff; font-size: 38px; }
        .summary h2 { margin: 0; font-size: 24px; font-weight: 500; word-break: break-word; }
        .muted { margin: 4px 0 0; font-size: 15px; color: #555; word-break: break-word; }
        .role-badge { margin-top: 12px; background: #dfeaf7; color: #1d3f6e; }
        .since { margin-top: 14px; font-size: 14px; color: #666; }

        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 20px; padding-top: 18px; border-top: 1px solid #e5e5e5; }
        .stat strong { display: block; font-size: 24px; font-weight: 600; }
        .stat span { font-size: 13px; color: #666; }

        .field { margin-bottom: 18px; }
        .field label { display: block; margin-bottom: 8px; font-size: 16px; font-weight: 500; }
        .field input { width: 100%; height: 46px; padding: 0 14px; border: 1px solid #d9d9d9; border-radius: 8px; background: #fff; font-family: inherit; font-size: 16px; color: var(--text); outline: none; transition: border-color .15s, box-shadow .15s; }
        .field input:focus { border-color: #3d5a1e; box-shadow: 0 0 0 3px rgba(61, 90, 30, .15); }
        .field input.is-invalid { border-color: #c62828; }
        .error-text { margin: 6px 0 0; font-size: 14px; color: #c62828; }
        .hint { margin: 6px 0 0; font-size: 13px; color: #666; }

        .btn-save { height: 46px; padding: 0 28px; border: 0; border-radius: 8px; background: #3d5a1e; color: #fff; font-family: inherit; font-size: 16px; font-weight: 600; cursor: pointer; }
        .btn-save:hover { background: #324a18; }

        @media (max-width: 800px) {
            .profile-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

    {{-- Header --}}
    <header class="header">
        <a href="{{ url('/') }}" class="brand">
            <img src="{{ asset('images/logo-sireva.png') }}" alt="SIREVA">
        </a>
    </header>

    {{-- Sidebar --}}
    <nav class="sidebar" aria-label="Menu utama">
        <button type="button" id="sidebarToggle" class="nav-item" aria-label="Buka atau tutup menu" aria-expanded="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M2 6h20M2 12h20M2 18h20"/>
            </svg>
        </button>

        <a href="{{ url('/') }}" class="nav-item {{ request()->routeIs('home') ? 'active' : '' }}" title="Beranda">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.5 1.5 11.5h3V21h5.5v-6h4v6h5.5v-9.5h3L12 2.5z"/>
            </svg>
            <span class="nav-label">Beranda</span>
        </a>

        <a href="{{ route('bookings.index') }}" class="nav-item " title="Peminjaman">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2.5" width="14" height="19" rx="2"/>
                <path d="M5 17.5h14M9 7h6"/>
            </svg>
            <span class="nav-label">Peminjaman</span>
        </a>

        <a href="{{ route('profile.edit') }}" class="nav-item {{ request()->routeIs('profile.*') ? 'active' : '' }}" title="Profil">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="9.5" r="3.2"/>
                <path d="M5.8 19c1.2-3 3.6-4.5 6.2-4.5s5 1.5 6.2 4.5"/>
            </svg>
            <span class="nav-label">Profil</span>
        </a>
        @if (auth()->user()->role === 'admin')
            <a href="{{ route('admin.rooms.index') }}" class="nav-item {{ request()->routeIs('admin.rooms.*') ? 'active' : '' }}" title="Kelola Ruangan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4" y="3" width="16" height="18" rx="1.5"/>
                    <path d="M9 21v-5h6v5M8 8h2M14 8h2M8 12h2M14 12h2"/>
                </svg>
                <span class="nav-label">Kelola Ruangan</span>
            </a>
            <a href="{{ route('admin.bookings.index') }}" class="nav-item {{ request()->routeIs('admin.bookings.*') ? 'active' : '' }}" title="Pengajuan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="3" width="14" height="18" rx="2"/>
                    <path d="M9 3h6v3H9zM9.5 14l2 2 3.5-4"/>
                </svg>
                <span class="nav-label">Pengajuan</span>
            </a>
            <a href="{{ route('admin.users.index') }}" class="nav-item {{ request()->routeIs('admin.users.*') ? 'active' : '' }}" title="Pengguna">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="8" r="3.5"/>
                    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.4c2.2.6 3.5 2.6 3.5 5.6"/>
                </svg>
                <span class="nav-label">Pengguna</span>
            </a>
        @endif
        <form method="POST" action="{{ route('logout') }}" class="logout-form">
            @csrf
            <button type="submit" class="nav-item" title="Keluar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                <span class="nav-label">Keluar</span>
            </button>
        </form>
    </nav>

    {{-- Konten --}}
    <main class="main">
        <h1 class="page-title">Profil</h1>
        <p class="page-sub">Kelola informasi akun kamu.</p>

        @if (session('success'))
            <div class="alert-success">{{ session('success') }}</div>
        @endif

        <div class="profile-grid">
            {{-- Ringkasan --}}
            <section class="card summary">
                <div class="avatar">{{ strtoupper(mb_substr($user->name, 0, 1)) }}</div>
                <h2>{{ $user->name }}</h2>
                <p class="muted">{{ $user->email }}</p>
                <span class="badge role-badge">{{ $user->role === 'admin' ? 'Admin' : 'Mahasiswa' }}</span>
                <p class="since">Bergabung sejak {{ $user->created_at->format('d/m/Y') }}</p>

                @if ($user->role !== 'admin')
                    <div class="stats">
                        <div class="stat"><strong>{{ $stats['total'] }}</strong><span>Total</span></div>
                        <div class="stat"><strong>{{ $stats['pending'] }}</strong><span>Menunggu</span></div>
                        <div class="stat"><strong>{{ $stats['approved'] }}</strong><span>Disetujui</span></div>
                    </div>
                @endif
            </section>

            <div class="col">
                {{-- Informasi akun --}}
                <section class="card">
                    <h3>Informasi akun</h3>
                    <form method="POST" action="{{ route('profile.update') }}" novalidate>
                        @csrf
                        @method('PATCH')

                        <div class="field">
                            <label for="name">Nama</label>
                            <input id="name" type="text" name="name" value="{{ old('name', $user->name) }}" required
                                   class="@error('name') is-invalid @enderror">
                            @error('name') <p class="error-text">{{ $message }}</p> @enderror
                        </div>

                        <div class="field">
                            <label for="email">Email</label>
                            <input id="email" type="email" name="email" value="{{ old('email', $user->email) }}" required
                                   class="@error('email') is-invalid @enderror">
                            @error('email') <p class="error-text">{{ $message }}</p> @enderror
                        </div>

                        <button type="submit" class="btn-save">Simpan</button>
                    </form>
                </section>

                {{-- Ubah password --}}
                <section class="card">
                    <h3>Ubah password</h3>
                    <form method="POST" action="{{ route('profile.password') }}" novalidate>
                        @csrf
                        @method('PUT')

                        <div class="field">
                            <label for="current_password">Password saat ini</label>
                            <input id="current_password" type="password" name="current_password" autocomplete="current-password" required
                                   class="@error('current_password') is-invalid @enderror">
                            @error('current_password') <p class="error-text">{{ $message }}</p> @enderror
                        </div>

                        <div class="field">
                            <label for="password">Password baru</label>
                            <input id="password" type="password" name="password" autocomplete="new-password" required
                                   class="@error('password') is-invalid @enderror">
                            <p class="hint">Minimal 8 karakter.</p>
                            @error('password') <p class="error-text">{{ $message }}</p> @enderror
                        </div>

                        <div class="field">
                            <label for="password_confirmation">Ulangi password baru</label>
                            <input id="password_confirmation" type="password" name="password_confirmation" autocomplete="new-password" required>
                        </div>

                        <button type="submit" class="btn-save">Ubah password</button>
                    </form>
                </section>
            </div>
        </div>
    </main>

    <script>
        (function () {
            var body = document.body;
            var btn = document.getElementById('sidebarToggle');
            var key = 'sireva_sidebar_open';

            function setOpen(open) {
                body.classList.toggle('sidebar-open', open);
                btn.setAttribute('aria-expanded', open ? 'true' : 'false');
                try { localStorage.setItem(key, open ? '1' : '0'); } catch (e) {}
            }

            try {
                if (localStorage.getItem(key) === '1' && window.innerWidth > 700) setOpen(true);
            } catch (e) {}

            btn.addEventListener('click', function () {
                setOpen(!body.classList.contains('sidebar-open'));
            });
        })();
    </script>

</body>
</html>