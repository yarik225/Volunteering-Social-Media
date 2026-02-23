<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHS Volunteering - Profile</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .header {
            background: #1e3a8a;
            color: white;
            padding: 1rem 2rem;
        }

        .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .brand h1 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }

        .nav-links {
            display: flex;
            gap: 1.5rem;
            margin-top: 0.5rem;
        }

        .nav-links a {
            color: white;
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .nav-links a:hover,
        .nav-links a.active {
            opacity: 1;
        }

        .logo-container {
            flex-shrink: 0;
        }

        .logo {
            height: 60px;
            width: auto;
        }

        .search-bar {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            min-width: 200px;
        }

        .search-bar i {
            margin-right: 0.5rem;
            opacity: 0.7;
        }

        .search-bar input {
            background: transparent;
            border: none;
            color: white;
            outline: none;
            width: 100%;
        }

        .search-bar input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }

        .gold-divider {
            height: 4px;
            background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
            margin-top: 1rem;
        }

        .profile-container {
            flex: 1;
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
            width: 100%;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 3rem;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .pfp-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1e3a8a);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            position: relative;
            transition: opacity 0.2s ease;
            overflow: hidden;
        }

        .pfp-circle:hover {
            opacity: 0.8;
        }

        .pfp-circle:hover::after {
            content: '📷';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            z-index: 2;
        }

        .user-details h2 {
            font-size: 2rem;
            color: #1e3a8a;
            margin-bottom: 0.5rem;
        }

        .user-details p {
            color: #666;
            font-size: 1.1rem;
        }

        .saved-section h3 {
            font-size: 1.8rem;
            color: #1e3a8a;
            margin-bottom: 1.5rem;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .card {
            background: white;
            border-radius: 12px;
            height: 200px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .bottom-bar {
            background: white;
            padding: 1rem 2rem;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: sticky;
            bottom: 0;
        }

        .bottom-bar i {
            font-size: 24px;
            color: #1e3a8a;
            cursor: pointer;
            transition: color 0.2s;
        }

        .bottom-bar i:hover {
            color: #3b82f6;
        }

        .fab-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .fab-button {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            border: none;
            color: white;
            font-size: 32px;
            font-weight: 300;
            line-height: 1;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin-top: -28px;
        }

        .fab-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        .fab-button:active {
            transform: scale(0.95);
        }

        @media (max-width: 768px) {
            .nav-container {
                flex-direction: column;
                gap: 1rem;
            }

            .user-info {
                flex-direction: column;
                text-align: center;
            }

            .card-grid {
                grid-template-columns: 1fr;
            }
        }
