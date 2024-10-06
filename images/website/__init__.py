import math
import os
import json
import random
from PIL import Image
import requests
from bs4 import BeautifulSoup, SoupStrainer
from urllib.parse import urljoin
import threading
from validator_collection import validators, checkers
import sys
from flask import Flask, render_template, url_for, redirect
from datetime import datetime

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True, static_folder='static')
    
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)
    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    def get_albums():
        with open(os.path.join(app.static_folder, f"albums/albums.json"), "r") as file:
            albums = [album for album in json.load(file)]
        return albums

    def get_images(album_id):
        images = [image for image in os.listdir(os.path.join(app.static_folder, f"albums/{album_id}")) if os.path.splitext(image)[1].lower() not in [".json", ""]]
        return images

    def random_image(album_id, thumbnail = True, homepage=False):
        if homepage:
            random_album = random.choice(album_id)
            return f"{random_album['filename']}/{random.choice(get_images(random_album['filename']))}"
        images = get_images(album_id)
        image = random.choice(images)
        if thumbnail:
            return get_thumbnail(album_id, image)
        return image

    def get_image(json_file, image_id):
        for image in json_file["images"]:
            if os.path.splitext(image["filename"])[0].lower() == image_id.lower():
                return image

    def get_json(album_id):
        with open(os.path.join(app.static_folder, f"albums/{album_id}/album.json"), "r") as file:
            json_file = json.load(file)
        return json_file
    
    def remove_extension(filename):
        return os.path.splitext(filename)[0]
    
    def create_thumbnail(album_id, image_filename):
        path_to_full_size = os.path.join(app.static_folder, f"albums/{album_id}")
        path_to_thumbnails = os.path.join(app.static_folder, f"albums/{album_id}/thumbnails")
        image_name = os.path.splitext(image_filename)[0]
        image_ext = os.path.splitext(image_filename)[1]
        image = Image.open(os.path.join(path_to_full_size, image_filename))
        full_width, full_height = image.size
        new_width, new_height = round(500 * full_width / full_height), 500
        thumbnail = image.resize((new_width, new_height))
        thumbnail.save(os.path.join(path_to_thumbnails, f"{image_name}_thumbnail{image_ext}"))

    def get_thumbnail(album_id, image_filename):
        path_to_thumbnails = os.path.join(app.static_folder, f"albums/{album_id}/thumbnails")
        image_name = os.path.splitext(image_filename)[0]
        image_ext = os.path.splitext(image_filename)[1]
        if not os.path.exists(path_to_thumbnails):
            os.makedirs(path_to_thumbnails)
        if not os.path.exists(os.path.join(path_to_thumbnails, f"{image_name}_thumbnail{image_ext}")):
            create_thumbnail(album_id, image_filename)
        return f"{image_name}_thumbnail{image_ext}"

    def outsidecam_get_thumbnail(directory):
        thumbnail = os.path.join(directory, "thumbnail.jpg")
        if os.path.isfile(thumbnail):   
            thumbnail_json = {
                "filename": "thumbnail.jpg",
                "date": datetime.fromtimestamp(os.path.getmtime(thumbnail)).strftime("%b %d, %Y at %H:%M")
            }
            return thumbnail_json
        return None
                
    def outsidecam_get_newest_image(directory):
        files = os.listdir(directory)
        if len(files) == 0:
            return None
        paths = [os.path.basename(filename) for filename in sorted([os.path.join(directory, basename) for basename in files], reverse=True) if ".mp4" not in filename and "thumbnail.jpg" not in filename]
        if len(paths) == 0:
            return None
        newest_image = paths[0]
        newest_image_json = {
            "filename": newest_image,
            "date": datetime.fromtimestamp(os.path.getmtime(os.path.join(directory, newest_image))).strftime("%b %d, %Y at %H:%M")
        }
        return newest_image_json

    def outsidecam_get_newest_gif(directory):
        files = os.listdir(directory)
        paths = [os.path.basename(filename) for filename in sorted([os.path.join(directory, basename) for basename in files], reverse=True) if ".mp4" in filename]
        if len(paths) == 0:
            return None
        newest_gif = paths[0]
        newest_gif_json = {
            "filename": newest_gif,
            "date": datetime.strptime(os.path.splitext(newest_gif)[0], "%Y%m%d").strftime("%b %d, %Y")
        }
        return newest_gif_json
    
    def outsidecam_get_gif_json(directory, page_number, max_gifs_per_page):
        files = os.listdir(directory)
        paths = [os.path.basename(filename) for filename in sorted([os.path.join(directory, basename) for basename in files], reverse=True)]
        gifs = [filename for filename in paths if ".mp4" in filename]
        if len(gifs) == 0:
            return None
        max_pages = math.ceil(len(gifs) / max_gifs_per_page)
        newest_file = gifs[(page_number - 1) * max_gifs_per_page]
        if page_number == max_pages:
            other_files = gifs[(page_number - 1) * max_gifs_per_page + 1:]
        else:
            other_files = gifs[(page_number - 1) * max_gifs_per_page + 1:(page_number) * max_gifs_per_page]
        gif_json = {
            "max_pages": max_pages,
            "new_image": {
                "filename": newest_file,
                "date": datetime.strptime(os.path.splitext(newest_file)[0], "%Y%m%d").strftime("%b %d, %Y")
            },
            "other_images": [
            ]
        }
        for gif in other_files:
            gif_json["other_images"].append({
                "filename": gif,
                "date": datetime.strptime(os.path.splitext(gif)[0], "%Y%m%d").strftime("%b %d, %Y")
            })
        return gif_json
    
    def outsidecam_get_image_json(directory, page_number, max_images_per_page):
        files = os.listdir(directory)
        paths = [os.path.basename(filename) for filename in sorted([os.path.join(directory, basename) for basename in files], reverse=True)]
        images = [filename for filename in paths if ".mp4" not in filename and "thumbnail.jpg" not in filename]
        if len(images) == 0:
            return None
        max_pages = math.ceil(len(images) / max_images_per_page)
        newest_file = images[(page_number - 1) * max_images_per_page]
        if page_number == max_pages:
            other_files = images[(page_number - 1) * max_images_per_page + 1:]
        else:
            other_files = images[(page_number - 1) * max_images_per_page + 1:(page_number) * max_images_per_page]
        image_json = {
            "max_pages": max_pages,
            "new_image": {
                "filename": newest_file,
                "date": datetime.fromtimestamp(os.path.getmtime(os.path.join(directory, newest_file))).strftime("%b %d, %Y at %H:%M")
            },
            "other_images": [
            ]
        }
        for image in other_files:
            image_json["other_images"].append({
                "filename": image,
                "date": datetime.fromtimestamp(os.path.getmtime(os.path.join(directory, image))).strftime("%b %d, %Y at %H:%M")
            })
        return image_json

            
    @app.route("/")
    def home():
        albums = get_albums()
        outsidecam_data = outsidecam_get_thumbnail(os.path.join(app.static_folder, 'outsidecam'))
        if outsidecam_data is None:
            outsidecam_image = None
        else:
            outsidecam_image = outsidecam_data["filename"]
        return render_template('home.html', albums=albums, random_image = random_image, get_json = get_json, get_thumbnail = get_thumbnail, outsidecam_image= outsidecam_image)

    @app.route("/home")
    def home2():
        return home()
    
    @app.route('/a/<album_id>')
    def album(album_id):
        with open(os.path.join(app.static_folder, f"albums/{album_id}/album.json"), "r") as file:
            json_file = json.load(file)
        return render_template('album.html', album_id = album_id, json_file = json_file, remove_extension = remove_extension, random_image = random_image, get_thumbnail = get_thumbnail) 
        
    @app.route('/a/<album_id>/<image_id>')
    def image(album_id, image_id):
        with open(os.path.join(app.static_folder, f"albums/{album_id}/album.json"), "r") as file:
            json_file = json.load(file)
        return render_template('image.html', album_id = album_id, image_id = image_id, album_json = json_file['album'], image_json = get_image(json_file, image_id), get_thumbnail = get_thumbnail) 

    @app.route('/outsidecam')
    def outsidecam():
        return render_template('outsidecam.html', newest_image=outsidecam_get_newest_image(os.path.join(app.static_folder, 'outsidecam')), newest_gif=outsidecam_get_newest_gif(os.path.join(app.static_folder, 'outsidecam')))
        
    @app.route('/outsidecam/images/<page_number>')
    def outsidecam_images(page_number):
        page_number = int(page_number)
        max_images_per_page = 10
        image_json = outsidecam_get_image_json(os.path.join(app.static_folder, "outsidecam"), page_number, max_images_per_page)
        if image_json == None:
            new_image = None
            other_images = None
            max_pages = page_number - 1
        else:
            new_image = image_json["new_image"]
            other_images = image_json["other_images"]
            max_pages = image_json["max_pages"]
        return render_template('outsidecam_images.html', new_image=new_image, other_images=other_images, page_number=page_number, max_pages=max_pages)

    @app.route('/outsidecam/gifs/<page_number>')
    def outsidecam_gifs(page_number):
        page_number = int(page_number)
        max_gifs_per_page = 10
        gif_json = outsidecam_get_gif_json(os.path.join(app.static_folder, "outsidecam"), page_number, max_gifs_per_page)
        if gif_json == None:
            new_image = None
            other_images = None
            max_pages = page_number - 1
        else:
            new_image = gif_json["new_image"]
            other_images = gif_json["other_images"]
            max_pages = gif_json["max_pages"]
        
        return render_template('outsidecam_gifs.html', new_image=new_image, other_images=other_images, page_number=page_number, max_pages=max_pages)
    
    return app


    
