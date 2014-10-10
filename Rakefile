# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Samson::Application.load_tasks

namespace :test do
  task :javascript do
    # Run the Javascript tests as well as the Rails tests.
    puts "Ensuring npm dependencies are installed... "
    puts `npm install` + "\n"
    puts "Executing Javascript tests...\n"
    IO.popen(["npm", "test", :err=>[:child, :out]]) {|io|
      output = io.read
      puts output
      if output =~ /Executed .* FAILED/
        fail "Failed Javascript tests!"
      end
    }
  end
end

desc "Run the Javascript tests as well"
Rake::Task[:test].enhance [ "test:javascript" ]
