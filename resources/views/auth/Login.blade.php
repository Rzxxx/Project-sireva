<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Masuk</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">

    <style>
        :root {
            --green: #3d5a1e;
            --green-hover: #324a18;
            --border: #d9d9d9;
            --text: #111;
            --muted: #b5b5b5;
            --link: #0b3fd9;
            --link-dark: #10248c;
            --accent-blue: #1d96f0;
            --error: #c62828;
        }

        *, *::before, *::after { box-sizing: border-box; }

        html, body { margin: 0; min-height: 100%; }

        body {
            font-family: 'Poppins', system-ui, sans-serif;
            color: var(--text);
            background: #d9d9d9;
        }

        .page {
            display: grid;
            place-items: center;
            min-height: 100vh;
            padding: 32px 16px;
        }

        .card {
            width: 100%;
            max-width: 460px;
            padding: 36px 40px 40px;
            border-radius: 24px;
            background: #fff;
        }

        .logo { display: flex; justify-content: center; margin-bottom: 28px; }
        .logo img { display: block; height: 52px; width: auto; }

        .title { margin: 0 0 8px; font-size: 28px; font-weight: 500; line-height: 1.2; }
        .title--solo { margin-bottom: 28px; }
        .subtitle { margin: 0 0 28px; font-size: 15px; }

        .field { margin-bottom: 20px; }

        .label-row {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .field label, .label-row label { font-size: 16px; font-weight: 500; }
        .field > label { display: block; margin-bottom: 8px; }

        .forgot { font-size: 13px; color: var(--link-dark); text-decoration: none; }
        .forgot:hover { text-decoration: underline; }

        .field input {
            width: 100%;
            height: 46px;
            padding: 0 14px;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-family: inherit;
            font-size: 15px;
            color: var(--text);
            background: #fff;
            outline: none;
            transition: border-color .15s, box-shadow .15s;
        }

        .field input::placeholder { color: var(--muted); font-size: 14px; }

        .field input:focus {
            border-color: var(--green);
            box-shadow: 0 0 0 3px rgba(61, 90, 30, .15);
        }

        .field input.is-invalid { border-color: var(--error); }

        .error-text { margin: 6px 0 0; font-size: 13px; color: var(--error); }

        .check {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 4px 0 6px;
            font-size: 14px;
        }

        .check input { width: 16px; height: 16px; margin: 0; accent-color: var(--green); }
        .check a { color: var(--text); text-decoration: underline; }

        .check-wrap { margin-bottom: 24px; }
        .check-wrap .error-text { margin-top: 2px; }

        .btn-primary {
            width: 100%;
            height: 48px;
            margin-top: 6px;
            border: 0;
            border-radius: 8px;
            background: var(--green);
            color: #fff;
            font-family: inherit;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background .15s;
        }

        .btn-primary:hover { background: var(--green-hover); }
        .btn-primary:focus-visible { outline: 2px solid var(--accent-blue); outline-offset: 2px; }

        .switch { margin: 24px 0 0; text-align: center; font-size: 15px; }
        .switch a { margin-left: 4px; color: var(--link); text-decoration: none; }
        .switch a:hover { text-decoration: underline; }

        @media (max-width: 520px) {
            .card { padding: 28px 22px 32px; border-radius: 20px; }
            .title { font-size: 24px; }
        }
    </style>
</head>
<body>
    <main class="page">
        <div class="card">
            <div class="logo">
                <img src="{{ asset('images/logo-sireva.png') }}" alt="SIREVA">
            </div>

            <h1 class="title">Welcome back!</h1>
            <p class="subtitle">Enter your Credentials to access your account</p>

            <form method="POST" action="{{ route('login') }}" novalidate>
                @csrf

                <div class="field">
                    <label for="email">Email address</label>
                    <input id="email" type="email" name="email" value="{{ old('email') }}"
                           placeholder="Enter your email" autocomplete="email" required autofocus
                           class="@error('email') is-invalid @enderror">
                    @error('email')
                        <p class="error-text">{{ $message }}</p>
                    @enderror
                </div>

                <div class="field">
                    <div class="label-row">
                        <label for="password">Password</label>
                        <a href="#" class="forgot">forgot password</a>
                    </div>
                    <input id="password" type="password" name="password"
                           placeholder="Enter your password" autocomplete="current-password" required
                           class="@error('password') is-invalid @enderror">
                    @error('password')
                        <p class="error-text">{{ $message }}</p>
                    @enderror
                </div>

                <div class="check-wrap">
                    <label class="check">
                        <input type="checkbox" name="remember" value="1" {{ old('remember') ? 'checked' : '' }}>
                        <span>Remember for 30 days</span>
                    </label>
                </div>

                <button type="submit" class="btn-primary">Login</button>
            </form>

            <p class="switch">
                Don’t have an account?
                <a href="{{ route('register') }}">Sign Up</a>
            </p>
        </div>
    </main>
</body>
</html>