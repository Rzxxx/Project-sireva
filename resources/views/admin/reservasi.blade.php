<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>SIREVA - Reservasi Admin</title>

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
    
        .head-row { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 16px; max-width: 1100px; }
        .btn-add { display: inline-block; padding: 12px 22px; border-radius: 8px; background: #3d5a1e; color: #fff; text-decoration: none; font-size: 16px; }
        .btn-add:hover { background: #324a18; }

        .room-card.admin-card { background: rgba(255, 255, 255, .92); }
        .room-card.off .room-thumb { filter: grayscale(1); opacity: .55; }
        .thumb-wrap { position: relative; }
        .status-badge { position: absolute; top: 10px; left: 10px; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; }
        .status-badge.on { background: #dff3d2; color: #274012; }
        .status-badge.off { background: #fbd9d9; color: #8a1c1c; }

        .admin-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
        .admin-row form { display: flex; align-items: center; gap: 10px; margin: 0; }
        .switch { position: relative; flex-shrink: 0; width: 46px; height: 26px; padding: 0; border: 0; border-radius: 999px; background: #b9b9b9; cursor: pointer; transition: background .15s; }
        .switch .knob { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform .15s; }
        .switch.on { background: #3d5a1e; }
        .switch.on .knob { transform: translateX(20px); }
        .switch:focus-visible { outline: 2px solid #1d96f0; outline-offset: 2px; }
        .switch-label { font-size: 15px; }

        .admin-actions { display: flex; gap: 8px; margin-top: 12px; }
        .admin-actions form { margin: 0; }
        .btn-edit { padding: 8px 14px; border-radius: 8px; background: #dfeaf7; color: #1d3f6e; text-decoration: none; font-size: 15px; }
        .btn-edit:hover { background: #cfdff2; }

        .room-card.add-card { align-items: center; justify-content: center; min-height: 220px; border: 2px dashed #999; background: rgba(255, 255, 255, .6); font-size: 18px; }

        form.thumb-wrap { margin: 0; }
        .thumb-upload { position: relative; display: block; cursor: pointer; }
        .upload-hint {
            position: absolute; left: 0; right: 0; bottom: 0; padding: 8px 12px;
            background: rgba(0, 0, 0, .6); color: #fff; font-size: 14px; text-align: center;
            opacity: 0; transition: opacity .15s;
        }
        .thumb-upload:hover .upload-hint, .thumb-upload:focus-within .upload-hint { opacity: 1; }
        @media (hover: none) { .upload-hint { opacity: 1; } }
        .alert-error { margin: 0 0 20px; padding: 12px 16px; border-radius: 8px; background: #fbd9d9; color: #8a1c1c; font-size: 16px; }
        .pending-banner { display: block; max-width: 1100px; margin: 0 0 20px; padding: 12px 16px; border-radius: 8px; background: #fff1c9; color: #7a5a00; font-size: 16px; text-decoration: none; }
        .pending-banner:hover { background: #ffe9a8; }

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
        <div class="head-row">
            <div>
                <h1 class="page-title">Reservasi Ruangan</h1>
                <p class="page-sub">Upload ruangan dan atur apakah ruangan itu tersedia atau tidak.</p>
            </div>
            <a href="{{ route('admin.rooms.create') }}" class="btn-add">+ Tambah ruangan</a>
        </div>

        @if (session('success'))
            <div class="alert-success">{{ session('success') }}</div>
        @endif
        @error('image')
            <div class="alert-error">{{ $message }}</div>
        @enderror

        @if (($pendingCount ?? 0) > 0)
            <a href="{{ route('admin.bookings.index') }}" class="pending-banner">
                {{ $pendingCount }} pengajuan peminjaman menunggu persetujuan →
            </a>
        @endif

        @php
            $usage = \App\Support\RoomStatus::usage();
            $inUse = $usage['inUse'];
            $nextBooking = $usage['next'];
        @endphp
        <div class="rooms">
            @foreach ($rooms as $room)
                <div class="room-card admin-card {{ $room->is_available ? '' : 'off' }}">
                    <form method="POST" action="{{ route('admin.rooms.photo', $room) }}" enctype="multipart/form-data" class="thumb-wrap">
                        @csrf
                        <label class="thumb-upload" title="Klik untuk {{ $room->image ? 'mengganti' : 'upload' }} foto">
                            @if ($room->image)
                                <img src="{{ asset($room->image) }}" alt="Foto {{ $room->name }}" class="room-thumb" loading="lazy">
                            @else
                                <div class="room-thumb room-thumb--empty">Belum ada foto</div>
                            @endif
                            <span class="upload-hint">{{ $room->image ? 'Ganti foto' : 'Upload foto' }}</span>
                            <input type="file" name="image" accept="image/png,image/jpeg,image/webp" hidden
                                   onchange="if (this.files[0].size > 2 * 1024 * 1024) { alert('Ukuran foto maksimal 2 MB.'); this.value = ''; return; } this.form.submit();">
                        </label>
                        @php $busy = $room->is_available && $inUse->has($room->id); @endphp
                        <span class="status-badge {{ $busy ? 'busy' : ($room->is_available ? 'on' : 'off') }}">
                            {{ $busy ? 'Sedang digunakan' : ($room->is_available ? 'Tersedia' : 'Tidak tersedia') }}
                        </span>
                    </form>

                    <div class="room-body">
                        <strong>{{ $room->name }}</strong>
                        <span class="room-meta">{{ $room->location ?? '-' }} · {{ $room->capacity }} orang</span>
                        @if ($inUse->has($room->id))
                            <span class="room-note">Sedang digunakan sampai {{ substr($inUse[$room->id]->end_time, 0, 5) }}</span>
                        @elseif ($nextBooking->has($room->id))
                            @php $nb = $nextBooking[$room->id]; @endphp
                            <span class="room-note">Dipinjam: {{ \Carbon\Carbon::parse($nb->date)->isToday() ? 'hari ini' : \Carbon\Carbon::parse($nb->date)->format('d/m') }} {{ substr($nb->start_time, 0, 5) }}-{{ substr($nb->end_time, 0, 5) }}</span>
                        @endif

                        <div class="admin-row">
                            <form method="POST" action="{{ route('admin.rooms.toggle', $room) }}">
                                @csrf
                                @method('PATCH')
                                <button type="submit"
                                        class="switch {{ $room->is_available ? 'on' : '' }}"
                                        role="switch"
                                        aria-checked="{{ $room->is_available ? 'true' : 'false' }}"
                                        aria-label="Ubah ketersediaan {{ $room->name }}">
                                    <span class="knob"></span>
                                </button>
                                <span class="switch-label">{{ $room->is_available ? 'Tersedia' : 'Tidak tersedia' }}</span>
                            </form>
                        </div>

                        <div class="admin-actions">
                            <a href="{{ route('admin.rooms.edit', $room) }}" class="btn-edit">Edit</a>
                            <form method="POST" action="{{ route('admin.rooms.destroy', $room) }}"
                                  onsubmit="return confirm('Hapus ruangan ini? Semua peminjaman untuk ruangan ini ikut terhapus.')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn-cancel">Hapus</button>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach

            <a href="{{ route('admin.rooms.create') }}" class="room-card add-card">+ Tambah ruangan</a>
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