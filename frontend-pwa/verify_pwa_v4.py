from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to Login...")
            # Navigate to Login
            page.goto("http://localhost:5173/login", timeout=60000)
            page.wait_for_selector('h1', timeout=60000)

            # Fill login form
            print("Filling form...")
            page.fill('input[name="username"]', "testuser")
            page.fill('input[name="password"]', "password")
            page.click('button[type="submit"]')

            # Wait for Home to load
            print("Waiting for Home...")
            page.wait_for_url("http://localhost:5173/", timeout=60000)
            page.wait_for_selector('h1:has-text("CONTENTS.")', timeout=60000)

             # Navigate to University
            print("Navigating to University...")
            page.click('text=UNIVERSITY')
            page.wait_for_url("http://localhost:5173/university", timeout=60000)

            # Wait for content to load
            page.wait_for_selector('h5:has-text("UNIVERSITY OF OXFORD")', timeout=60000)
            page.screenshot(path="/home/jules/verification/university_screen.png")
            print("Captured university_screen.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
