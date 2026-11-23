<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>SIREVA - Beranda</title>

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
        .greeting {
            margin: 0;
            font-size: 42px;
            font-weight: 400;
            line-height: 1.2;
        }

        .tagline {
            margin: 10px 0 80px;
            padding-left: 24px;
            font-size: 19px;
        }

        .tagline a { color: inherit; text-decoration: underline; }

        .rooms-title {
            margin: auto 0 18px;
            font-size: 26px;
            font-weight: 400;
        }

        .rooms {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 32px;
            max-width: 1100px;
        }

        .room-card {
            display: flex;
            align-items: flex-end;
            min-height: 170px;
            padding: 16px;
            border-radius: 10px;
            background: var(--card-bg);
            color: var(--text);
            font-size: 18px;
            text-decoration: none;
        }

        a.room-card:hover { filter: brightness(.96); }
        .room-card { flex-direction: column; align-items: flex-start; justify-content: flex-end; gap: 4px; }
        .room-meta { font-size: 14px; color: #555; }

        .room-card { padding: 0; overflow: hidden; align-items: stretch; justify-content: flex-start; gap: 0; transition: transform .15s, box-shadow .15s; }
        .room-card:empty { min-height: 170px; }
        a.room-card:hover { filter: none; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, .15); }

        .room-thumb { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: #c9c9c9; }
        .room-thumb--empty { display: grid; place-items: center; color: #777; font-size: 14px; }
        .room-body { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px 16px; }

        .alert-success {
            margin: 0 0 20px;
            padding: 12px 16px;
            border-radius: 8px;
            background: #e3f4d7;
            color: #274012;
            font-size: 16px;
        }

        @media (max-width: 700px) {
            .greeting { font-size: 30px; }
            .tagline { padding-left: 0; font-size: 16px; }
            .rooms-title { font-size: 22px; }
        }

        .status-chip { align-self: flex-start; margin-top: 6px; padding: 3px 10px; border-radius: 999px; font-size: 13px; font-weight: 600; }
        .chip-free { background: #dff3d2; color: #274012; }
        .chip-busy { background: #ffe3c2; color: #8a4b00; }
        .room-note { font-size: 13px; color: #666; }
        .room-card.busy .room-thumb { filter: grayscale(.6); opacity: .75; }
        .status-badge.busy { background: #ffe3c2; color: #8a4b00; }
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

        <a href="{{ route('bookings.index') }}" class="nav-item {{ request()->routeIs('bookings.*') ? 'active' : '' }}" title="Peminjaman">
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
            @php
        $hour = now()->hour;
        $greeting = match (true) {
            $hour < 11 => 'Selamat Pagi',
            $hour < 15 => 'Selamat Siang',
            $hour < 18 => 'Selamat Sore',
            default    => 'Selamat Malam',
        };
        $userName = auth()->user()->name ?? 'Nama User';
    @endphp

    @if (session('success'))
        <div class="alert-success">{{ session('success') }}</div>
    @endif

    <h1 class="greeting">{{ $greeting }}, {{ $userName }}</h1>
    <p class="tagline">
        Peminjaman Ruangan Mudah Dan Cepat, silahkan <a href="{{ route('bookings.index') }}">klik disini</a>.
    </p>

    <h2 class="rooms-title" id="ruangan">Ruangan yang tersedia:</h2>

    @php
            $usage = \App\Support\RoomStatus::usage();
            $inUse = $usage['inUse'];
            $nextBooking = $usage['next'];
        @endphp
        <div class="rooms">
        @forelse (($rooms ?? []) as $room)
            <a href="{{ route('bookings.create', $room) }}" class="room-card {{ $inUse->has($room->id) ? 'busy' : '' }}">
                @if ($room->image)
                    <img src="{{ asset($room->image) }}" alt="Foto {{ $room->name }}" class="room-thumb" loading="lazy">
                @else
                    <div class="room-thumb room-thumb--empty">Belum ada foto</div>
                @endif
                <div class="room-body">
                    <strong>{{ $room->name }}</strong>
                    <span class="room-meta">{{ $room->location }} · {{ $room->capacity }} orang</span>
                    @if ($inUse->has($room->id))
                        <span class="status-chip chip-busy">Sedang digunakan</span>
                        <span class="room-note">Sampai {{ substr($inUse[$room->id]->end_time, 0, 5) }}</span>
                    @else
                        <span class="status-chip chip-free">Tersedia</span>
                        @if ($nextBooking->has($room->id))
                            @php $nb = $nextBooking[$room->id]; @endphp
                            <span class="room-note">Dipinjam: {{ \Carbon\Carbon::parse($nb->date)->isToday() ? 'hari ini' : \Carbon\Carbon::parse($nb->date)->format('d/m') }} {{ substr($nb->start_time, 0, 5) }}-{{ substr($nb->end_time, 0, 5) }}</span>
                        @endif
                    @endif
                </div>
            </a>
        @empty
            {{-- Placeholder sesuai desain --}}
            <div class="room-card"></div>
            <div class="room-card"></div>
            <div class="room-card"></div>
        @endforelse
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