from databaseManager import create_shop
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import re


options = Options()
# options.add_argument("--headless")  # Run Chrome in headless mode
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

def read_file(file):
    with open(file, "r") as f:
        return f.read()

def parse_opening_hours(opening_hours_text):
    opening_hours_dict = {}
    current_day = None

    for line in opening_hours_text.split('\n'):
        line = line.strip()
        if ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].count(line) > 0:
            current_day = line
            opening_hours_dict[current_day] = []
        elif current_day is not None:
            match = re.match(r"(\d{1,2}:\d{2})[–-](\d{1,2}:\d{2})", line)
            if match is not None:
                opening_hours_dict[current_day].append({"open": match.group(1), "close": match.group(2)})
            elif line == "Geschlossen":
                opening_hours_dict[current_day] = [{"open": "00:00", "close": "00:00"}]
            elif line == "24 Stunden geöffnet":
                opening_hours_dict[current_day] = [{"open": "00:00", "close": "23:59"}]

    return opening_hours_dict


def getData(url):
    driver.get(url)
    lat, long = re.search(r'@(\d+\.\d+),(\d+\.\d+)', driver.page_source).groups()
    lat = float(lat)
    long = float(long)
    try:
        driver.find_element(By.CLASS_NAME, "aSftqf")
        print("Shop closed")
        return None, None, None, None, None, None, None, None, None, None
    except:
        pass
    try:
        name = driver.find_element(By.CLASS_NAME, "DUwDvf.lfPIob").text
        imageURL = driver.find_element(By.CLASS_NAME, "aoRNLd.kn2E5e.NMjTrf.lvtCsd img").get_attribute("src")
        address = driver.find_element(By.CLASS_NAME, "Io6YTe").text
        rating = driver.find_element(By.CLASS_NAME, "F7nice").text[:2].replace(",", ".")
        rating = float(rating)
        rating = round(rating)
    except:
        print("Shop has not enough information")
        return None, None, None, None, None, None, None, None, None, None
    try:
        priceCategory = driver.find_element(By.CLASS_NAME, "mgr77e").text.count("€")
    except:
        priceCategory = 0
    tel = ""
    tel_elements = driver.find_elements(By.CLASS_NAME, "AeaXub")
    for t in tel_elements:
        print(t.get_attribute("outerHTML"))
        if "Odf5Vc google-symbols NhBTye PHazN" in t.get_attribute("outerHTML"):
            print("Found tel")
            tel = t.text.replace("\n", "").strip()
            break
    try:
        dropdownspan = driver.find_element(By.CLASS_NAME, "ZDu9vd")
        driver.execute_script("arguments[0].click();", dropdownspan)
        opening = ""
        while opening == "":
            opening = driver.find_element(By.CLASS_NAME, "t39EBf.GUrTXd").text
    except:
        try:
            openingButtonParent = driver.find_element(By.CLASS_NAME, "RcCsl.fVHpi.w4vB1d.NOE9ve.AG25L.lk2Rcf")
            openingButton = openingButtonParent.find_element(By.TAG_NAME, "button")
            driver.execute_script("arguments[0].click();", openingButton)
        except:
            print("Shop has no opening hours")
            return None, None, None, None, None, None, None, None, None, None
        opening = ""
        while opening == "":
            try:
                opening = driver.find_element(By.CLASS_NAME, "eK4R0e").text
            except:
                pass
        backButton = driver.find_element(By.CLASS_NAME, "hYBOP.FeXq4d")
        backButton.click()
    openingHours = parse_opening_hours(opening)
    if openingHours == {}:
        print("Parsing opening hours failed")
        return None, None, None, None, None, None, None, None, None, None
    time.sleep(0.2)
    try:
        button = driver.find_elements(By.CLASS_NAME, "hh2c6")[2]
        driver.execute_script("arguments[0].click();", button)
    except:
        print("Button not found")
        return None, None, None, None, None, None, None, None, None, None
    time.sleep(0.2)
    flags = ""
    zahlung = driver.find_elements(By.CLASS_NAME, "hpLkke")
    time.sleep(0.1)
    for i in zahlung:
        i_class = i.get_attribute("class")
        if "WeoVJe" in i_class:
            continue
        flags += i.text + ", "
    maps_url = url

    return name, imageURL, address, rating, priceCategory, flags, openingHours, tel, lat, long, maps_url

if __name__ == "__main__":
    with open("backend/shops_url.txt", "r") as f:
        urls = f.readlines()
    driver.get("https://www.google.com/maps")
    button_class = "XWZjwc"
    button = driver.find_element(By.CLASS_NAME, button_class)
    button.click()
    failed_shops = []
    successful_shops = []
    for i, url in enumerate(urls):
        # clear the console
        # print("\033[H\033[J")
        print("Creating shop: " + url.split("/")[5])
        print("URL: " + url)
        print("Success: " + str(len(successful_shops)) + " Failed: " + str(len(failed_shops)))
        print("Already done: " + str(len(successful_shops) + len(failed_shops)))
        print("Remaining: " + str(len(urls) - i))
        print("Total: " + str(len(urls)))
        url = url.strip()
        name, imageURL, address, rating, priceCategory, flags, openingHours, tel, lat, long, maps_url = getData(url)
        if name is not None:
            create_shop(name, imageURL, address, rating, priceCategory, flags, openingHours, tel, lat, long, maps_url)
            # in green
            print("\033[92m" + "Shop created" + "\033[0m")
            successful_shops.append(url)
        else:
            # write in red in console
            print("\033[91m" + "Shop closed" + "\033[0m")
            failed_shops.append(url)
        time.sleep(0.5)