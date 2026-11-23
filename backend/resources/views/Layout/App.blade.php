<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'SIREVA')</title>

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
    </style>
    @stack('styles')
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

        <a href="#" class="nav-item" title="Peminjaman">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2.5" width="14" height="19" rx="2"/>
                <path d="M5 17.5h14M9 7h6"/>
            </svg>
            <span class="nav-label">Peminjaman</span>
        </a>

        <a href="#" class="nav-item" title="Profil">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="9.5" r="3.2"/>
                <path d="M5.8 19c1.2-3 3.6-4.5 6.2-4.5s5 1.5 6.2 4.5"/>
            </svg>
            <span class="nav-label">Profil</span>
        </a>
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
        @yield('content')
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