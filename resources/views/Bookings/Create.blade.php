<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>SIREVA - Pinjam {{ $room->name }}</title>

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
    .booking { width: 100%; max-width: 640px; }

    .back { display: inline-block; margin-bottom: 16px; color: var(--text); font-size: 16px; text-decoration: none; }
    .back:hover { text-decoration: underline; }

    .booking h1 { margin: 0 0 8px; font-size: 36px; font-weight: 400; line-height: 1.2; }

    .room-info {
        margin: 0 0 28px;
        font-size: 18px;
    }

    .card {
        padding: 28px;
        border-radius: 12px;
        background: rgba(255, 255, 255, .9);
    }

    .field { margin-bottom: 20px; }
    .field label { display: block; margin-bottom: 8px; font-size: 17px; font-weight: 500; }

    .field input, .field textarea {
        width: 100%;
        padding: 0 14px;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
        background: #fff;
        font-family: inherit;
        font-size: 16px;
        color: var(--text);
        outline: none;
        transition: border-color .15s, box-shadow .15s;
    }

    .field input { height: 46px; }
    .field input[readonly] { background: #f3f3f3; }

    .field input:focus {
        border-color: #3d5a1e;
        box-shadow: 0 0 0 3px rgba(61, 90, 30, .15);
    }

    .field input.is-invalid { border-color: #c62828; }
    .error-text { margin: 6px 0 0; font-size: 14px; color: #c62828; }

    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    .actions { display: flex; gap: 12px; margin-top: 8px; }

    .btn {
        flex: 1;
        display: inline-grid;
        place-items: center;
        height: 48px;
        border: 0;
        border-radius: 8px;
        font-family: inherit;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
    }

    .btn-primary { background: #3d5a1e; color: #fff; }
    .btn-primary:hover { background: #324a18; }
    .btn-secondary { background: #e4e4e4; color: var(--text); }
    .btn-secondary:hover { background: #d8d8d8; }

    @media (max-width: 700px) {
        .booking h1 { font-size: 28px; }
        .row { grid-template-columns: 1fr; gap: 0; }
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
    <div class="booking">
        <a href="{{ route('home') }}" class="back">← Kembali</a>

        <h1>Form Peminjaman Ruangan</h1>
        <p class="room-info">
            <strong>{{ $room->name }}</strong>
            @if ($room->location) · {{ $room->location }} @endif
            · Kapasitas {{ $room->capacity }} orang
        </p>

        <form method="POST" action="{{ route('bookings.store', $room) }}" class="card" novalidate>
            @csrf

            <div class="field">
                <label for="borrower">Nama peminjam</label>
                <input id="borrower" type="text" value="{{ auth()->user()->name }}" readonly>
            </div>

            <div class="field">
                <label for="date">Tanggal</label>
                <input id="date" type="date" name="date" value="{{ old('date') }}"
                       min="{{ now()->toDateString() }}" required
                       class="@error('date') is-invalid @enderror">
                @error('date') <p class="error-text">{{ $message }}</p> @enderror
            </div>

            <div class="row">
                <div class="field">
                    <label for="start_time">Jam mulai</label>
                    <input id="start_time" type="time" name="start_time" value="{{ old('start_time') }}" required
                           class="@error('start_time') is-invalid @enderror">
                    @error('start_time') <p class="error-text">{{ $message }}</p> @enderror
                </div>

                <div class="field">
                    <label for="end_time">Jam selesai</label>
                    <input id="end_time" type="time" name="end_time" value="{{ old('end_time') }}" required
                           class="@error('end_time') is-invalid @enderror">
                    @error('end_time') <p class="error-text">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="field">
                <label for="participants">Jumlah peserta</label>
                <input id="participants" type="number" name="participants" min="1" max="{{ $room->capacity }}"
                       value="{{ old('participants') }}" placeholder="Maksimal {{ $room->capacity }}" required
                       class="@error('participants') is-invalid @enderror">
                @error('participants') <p class="error-text">{{ $message }}</p> @enderror
            </div>

            <div class="field">
                <label for="purpose">Keperluan</label>
                <input id="purpose" type="text" name="purpose" value="{{ old('purpose') }}"
                       placeholder="Contoh: Rapat organisasi" maxlength="255" required
                       class="@error('purpose') is-invalid @enderror">
                @error('purpose') <p class="error-text">{{ $message }}</p> @enderror
            </div>

            <div class="actions">
                <a href="{{ route('home') }}" class="btn btn-secondary">Batal</a>
                <button type="submit" class="btn btn-primary">Ajukan Peminjaman</button>
            </div>
        </form>
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